(function($){
  var init = function(dict){
    var strs = dict.split(/\s+/), creep, type = decodeURIComponent(queryParse(location.search).stype);
    creep = edit.words(strs, type);
    $('h1').eq(0).text(creep.type);
    document.title = creep.type;
    $('#go').click(function(){
      $("#show").html(creep.check($("#word").val().toLowerCase()).join(", "))
    });
  };
  
  $(function(){
    window.localStorage && window.localStorage.dict ? 
      init(window.localStorage.dict) : 
      $.ajax('javascripts/dictionary.txt').done(function(data){
        window.localStorage.dict = data.toLowerCase();
        init(data);
      });
  });
  
  var queryParse = function(search){
		if(/^[#\?]/.test(search))search=search.slice(1);
		var a=search.split("&"),o={};
		for(var i=0;i<a.length;i++){
			var b= a[i].split("=");
			o[b[0]]=b[1];
		}
		return o;
	};
})(jQuery)