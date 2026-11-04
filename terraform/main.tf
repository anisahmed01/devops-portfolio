# ==============================================================================
# Terraform Architecture Blueprint for AWS EKS & Multi-AZ Infrastructure
# Managed by Anis Ahmed | DevOps Portfolio Showcase
# ==============================================================================

terraform {
  required_version = ">= 1.7.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.50.0"
    }
  }

  backend "s3" {
    bucket         = "anisahmed-terraform-remote-state-prod"
    key            = "platform/eks/terraform.tfstate"
    region         = "ap-south-1"
    dynamodb_table = "anisahmed-terraform-state-lock"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "DevOps Platform"
      ManagedBy   = "Terraform"
      Owner       = "Anis Ahmed"
      Environment = var.environment
    }
  }
}

# ------------------------------------------------------------------------------
# 1. High-Availability Multi-AZ VPC
# ------------------------------------------------------------------------------
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.8.0"

  name = "${var.environment}-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["${var.aws_region}a", "${var.aws_region}b", "${var.aws_region}c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  enable_nat_gateway   = true
  single_nat_gateway   = var.environment == "prod" ? false : true
  enable_dns_hostnames = true
  enable_dns_support   = true

  public_subnet_tags = {
    "kubernetes.io/role/elb" = 1
  }

  private_subnet_tags = {
    "kubernetes.io/role/internal-elb" = 1
  }
}

# ------------------------------------------------------------------------------
# 2. AWS Elastic Kubernetes Service (EKS) Cluster
# ------------------------------------------------------------------------------
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.8.0"

  cluster_name    = "${var.environment}-control-plane"
  cluster_version = "1.30"

  cluster_endpoint_public_access = true

  vpc_id                   = module.vpc.vpc_id
  subnet_ids               = module.vpc.private_subnets
  control_plane_subnet_ids = module.vpc.private_subnets

  eks_managed_node_groups = {
    general = {
      name           = "worker-nodes-general"
      instance_types = ["t3.medium"]

      min_size     = 2
      max_size     = 6
      desired_size = 3

      capacity_type = "ON_DEMAND"

      labels = {
        role = "worker"
        env  = var.environment
      }
    }
  }

  enable_cluster_creator_admin_permissions = true
}
