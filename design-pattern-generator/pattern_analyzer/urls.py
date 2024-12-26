from django.urls import path
from .views import CodeAnalysisView

urlpatterns = [
    path('', CodeAnalysisView.as_view(), name='code-analysis'),
] 