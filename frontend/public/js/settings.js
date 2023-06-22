function previewImage(event) {
    var input = event.target;
    var preview = document.getElementById('preview');
    
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      
      reader.onload = function(e) {
        preview.src = e.target.result;
        preview.classList += "w-25";
      };
      
      reader.readAsDataURL(input.files[0]);
    }
}