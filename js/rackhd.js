function GetAllNodes(){
    $.ajax({  
        url:"http://10.32.3.179:8080/api/2.0/nodes",    
        type: "GET",  
        //data:JSON.stringify(data_param),  
        headers:{   
            "Accept":"application/json"  
        },  
        contentType: 'application/json; charset=UTF-8',      
        dataType: "json",  
        success: function(data) {
            $("#nodelist").empty();
            output="";
            for (var i=0;i<data.length;++i){
                if (data[i].type=="compute") {
                    output+=data[i].name + " "+ data[i].id + "<br>";
                    //$("#nodelist").append('<div class="name">' + data[i].name + '</>');
                }
            }
            $("#nodelist").append(output);
        },  
        error: function(XMLHttpRequest, textStatus, errorThrown) {  
            alert(XMLHttpRequest.status);  
            alert(XMLHttpRequest.readyState);  
            alert(textStatus);  
        },  
        complete: function(XMLHttpRequest, textStatus) {  
            //$("#message").text("successfully")
        }  
    });  
}

function GetNode(){
    mac=$("#macinfo").val();
    $.ajax({  
        url:"http://10.32.3.179:8080/api/2.0/nodes",    
        type: "GET",  
        //data:JSON.stringify(data_param),  
        headers:{   
            "Accept":"application/json"  
        },  
        contentType: 'application/json; charset=UTF-8',      
        dataType: "json",  
        success: function(data) {
            $("#nodeinfo").empty();
            output="";
            for (var i=0;i<data.length;++i){
                if (data[i].type=="compute" && data[i].name==mac) {
                    output+=data[i].name + " "+ data[i].id + "<br>";
                    //$("#nodelist").append('<div class="name">' + data[i].name + '</>');
                }
            }
            if (output=="") $("#nodeinfo").text("not found");
            else $("#nodeinfo").html(output);
        },  
        error: function(XMLHttpRequest, textStatus, errorThrown) {  
            alert(XMLHttpRequest.status);  
            alert(XMLHttpRequest.readyState);  
            alert(textStatus);  
        },  
        complete: function(XMLHttpRequest, textStatus) {  
            //$("#message").text("successfully")
        }  
    });  
}