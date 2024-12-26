from rest_framework import serializers

class ProjectAnalysisSerializer(serializers.Serializer):
    project_path = serializers.CharField(required=True)
    source_dir = serializers.CharField(required=False, default='src')
    scan_type = serializers.CharField(required=False, default='full')

    def validate_scan_type(self, value):
        valid_types = ['full', 'quick', 'basic']
        if value.lower() not in valid_types:
            raise serializers.ValidationError(f"scan_type must be one of {valid_types}")
        return value.lower()
