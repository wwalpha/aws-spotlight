[
  {
    "name": "${container_name}",
    "image": "${container_image}",
    "essential": true,
    "dependsOn" : [
      {
        "containerName": "envoy",
        "condition": "HEALTHY"
      }
    ],
    "environmentFiles": [
      {
        "value": "${env_file_arn}",
        "type": "s3"
      }
    ],
    "portMappings": [
      {
        "containerPort": ${container_port},
        "protocol": "tcp"
      }
    ],
    "logConfiguration": {
      "logDriver": "awslogs",
      "secretOptions": null,
      "options": {
        "awslogs-create-group": "true",
        "awslogs-group": "/ecs/${container_name}",
        "awslogs-region": "${aws_region}",
        "awslogs-stream-prefix": "ecs"
      }
    }
  },
  {
    "name": "xray-daemon",
    "image": "amazon/aws-xray-daemon",
    "essential": true,
    "cpu": 32,
    "memoryReservation": 256,
    "portMappings": [
      {
        "containerPort": 2000,
        "hostPort": 2000,
        "protocol": "udp"
      }
    ],
    "logConfiguration": {
      "logDriver": "awslogs",
      "secretOptions": null,
      "options": {
        "awslogs-create-group": "true",
        "awslogs-group": "/ecs/xray-daemon",
        "awslogs-region": "${aws_region}",
        "awslogs-stream-prefix": "ecs"
      }
    }
  },
  {
    "name": "envoy",
    "user": "1337",
    "image": "840364872350.dkr.ecr.${aws_region}.amazonaws.com/aws-appmesh-envoy:v1.17.2.0-prod",
    "memory" : 500,
    "essential": true,
    "environment": [
      {
        "name": "APPMESH_VIRTUAL_NODE_NAME",
        "value": "${app_mesh_node}"
      },
      {
        "name": "ENABLE_ENVOY_XRAY_TRACING",
        "value": "1"
      }
    ],
    "healthCheck": {
      "command": [
        "CMD-SHELL",
        "curl -s http://localhost:9901/server_info | grep state | grep -q LIVE"
      ],
      "startPeriod": 10,
      "interval": 5,
      "timeout": 2,
      "retries": 3
    }
  }
]
