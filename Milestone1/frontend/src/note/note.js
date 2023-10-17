tinymce.init({
    selector: 'textarea#default',
    menubar: 'file edit view insert format',
    toolbar: 'undo redo | fontfamily fontsize| bold italic underline| alignleft aligncenter alignright alignjustify | ' +
    'bullist numlist outdent indent | link image | preview media fullscreen | ' +
    ' forecolor backcolor emoticons',
    plugins: 'image',
    a11y_advanced_options: true,
    promotion: false,
    branding: false,
    width: '100%',
    height: '100vh',
    elementpath: false
});