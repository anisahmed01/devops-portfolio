# ==============================================================================
# Terraform Outputs for AWS EKS Infrastructure
# ==============================================================================

output "cluster_id" {
  description = "The name/ID of the EKS cluster."
  value       = module.eks.cluster_name
}

output "cluster_arn" {
  description = "The Amazon Resource Name (ARN) of the cluster."
  value       = module.eks.cluster_arn
}

output "cluster_endpoint" {
  description = "Endpoint for EKS control plane API."
  value       = module.eks.cluster_endpoint
}

output "cluster_security_group_id" {
  description = "Security group IDs attached to the cluster control plane."
  value       = module.eks.cluster_security_group_id
}

output "vpc_id" {
  description = "The ID of the VPC."
  value       = module.vpc.vpc_id
}

output "private_subnets" {
  description = "List of IDs of private subnets for EKS worker nodes."
  value       = module.vpc.private_subnets
}

output "public_subnets" {
  description = "List of IDs of public subnets for Application Load Balancers."
  value       = module.vpc.public_subnets
}

output "configure_kubectl" {
  description = "Run this command to update your local kubeconfig for the cluster."
  value       = "aws eks --region ${var.aws_region} update-kubeconfig --name ${module.eks.cluster_name}"
}

