(function($){
  var init = function(dict){
    var words = dict.split(/\s+/);
    edit.train(words);
  };
  
  $(function(){
    window.localStorage && window.localStorage.dict ? 
      init(window.localStorage.dict) : 
      $.ajax('javascripts/dictionary.txt').done(function(data){
        window.localStorage.dict = data.toLowerCase();
        init(data);
      });
  });
})(jQuery)