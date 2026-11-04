variable "aws_region" {
  description = "The AWS region to deploy infrastructure into."
  type        = string
  default     = "ap-south-1"
}

variable "environment" {
  description = "Deployment target environment (dev, staging, prod)."
  type        = string
  default     = "prod"
}
