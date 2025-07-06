from django.urls import path

from . import views

urlpatterns = [
    path('login/', views.login_view, name="login"),
    path('logout/', views.logout_view, name="logout"),
    path('signup/', views.signup, name="signup"),
    path('me/profile/', views.update_profile, name="update_profile"),
    path('me/details_profile/', views.details_profile, name="details_profile"),
    path('api/user-config/', views.get_user_config, name="get_user_config"),
]

