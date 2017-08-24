/**
 * New node file
 */
function uploadFile(){
  var formData = new FormData($("#frmUploadFile")[0]);
  $.ajax({
    url: '/upload',
    type: 'POST',
    data: formData,
    async: false,
    cache: false,
    contentType: false,
    processData: false,
    success: function(data){
      if(200 === data.code) {
        $("#imgShow").attr('src', data.msg.url);
        $("#spanMessage").html("upload successfully");
      } else {
        $("#spanMessage").html("upload failed");
      }
      console.log('imgUploader upload success, data:', data);
    },
    error: function(){
      $("#spanMessage").html("error when connecting server");
    }
  });
}