from django.urls import path
from .views import CodeAnalysisView

urlpatterns = [
    path('api/analyze/', CodeAnalysisView.as_view(), name='code-analysis'),
] 