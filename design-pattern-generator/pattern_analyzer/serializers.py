from rest_framework import serializers

class ProjectAnalysisSerializer(serializers.Serializer):
    project_path = serializers.CharField(required=True)
    scan_type = serializers.CharField(required=False, default='full')

    def validate_scan_type(self, value):
        valid_types = ['full', 'quick', 'basic']
        if value.lower() not in valid_types:
            raise serializers.ValidationError(f"scan_type must be one of {valid_types}")
        return value.lower()

    def validate_project_path(self, value):
        import os
        if not os.path.exists(value):
            raise serializers.ValidationError(f"Project path does not exist: {value}")
        return value
