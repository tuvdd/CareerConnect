from rest_framework import permissions


class IsOwnerOrAdminOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        # Kiểm tra xem user hiện tại có role là admin không
        if request.user.role == 'admin':
            return True

        # Kiểm tra xem user hiện tại có phải là chủ sở hữu của Job hoặc Application không
        if hasattr(obj, 'job'):
            if obj.job.company.user == request.user:
                return True

        if hasattr(obj, 'company'):
            if obj.company.user == request.user:
                return True

        if hasattr(obj, 'candidate'):
            if obj.candidate.user == request.user:
                return True

        return False
