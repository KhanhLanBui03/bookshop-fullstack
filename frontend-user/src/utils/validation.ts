
export const validationPatterns = {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, // At least 8 chars, one letter and one number
    phone: /^(0[3|5|7|8|9])([0-9]{8})$/, // Vietnam phone format
    fullName: /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴÝỶỸửữựỳỵỷỹý\s]{2,50}$/
};

export const validateField = (name: string, value: string, additionalData?: any) => {
    switch (name) {
        case 'email':
            if (!value) return 'Email không được để trống';
            if (!validationPatterns.email.test(value)) return 'Email không đúng định dạng';
            return '';
            
        case 'password':
            if (!value) return 'Mật khẩu không được để trống';
            if (value.length < 8) return 'Mật khẩu phải có ít nhất 8 ký tự';
            if (!validationPatterns.password.test(value)) return 'Mật khẩu phải bao gồm cả chữ và số';
            return '';

        case 'confirmPassword':
            if (!value) return 'Vui lòng xác nhận lại mật khẩu';
            if (value !== additionalData?.password) return 'Mật khẩu xác nhận không khớp';
            return '';

        case 'fullName':
        case 'name':
            if (!value) return 'Họ và tên không được để trống';
            if (!validationPatterns.fullName.test(value)) return 'Họ tên không hợp lệ (2-50 ký tự, không chứa số)';
            return '';

        case 'phone':
            if (!value) return 'Số điện thoại không được để trống';
            if (!validationPatterns.phone.test(value)) return 'Số điện thoại không hợp lệ (VD: 0912345678)';
            return '';

        default:
            return '';
    }
};
