from rest_framework import permissions

class IsOwnerOrAdminOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        if hasattr(obj, 'user'):
            # Kiểm tra xem user hiện tại là chủ sở hữu hoặc là admin
            if obj.user == request.user or request.user.role == 'admin':
                return True
        
        return False