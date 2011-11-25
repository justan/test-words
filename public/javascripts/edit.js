/**
  * 编辑距离js示例
  */
(function(exports){
  var words = {};
  var train = function(strs){
    strs.forEach(function(word){
      words[word] = 1;
    });
  };
  
  var edit = function (){
    var alphabet = 'abcdefghijklmnopqrstuvwxyz';
    var fn = function edit(word){
      var ret = [];
      return ret.concat(fn.insert(word)).concat(fn.remove(word)).concat(fn.alter(word)).concat(fn.transpose(word));
    };
    fn.insert = function(word){
      var ret = [], w, l = word.length, m = alphabet.length;
      word = word.toLowerCase();
      for(var i = 0; i < l + 1; i++)
        for(var j = 0; j < m; j++)
          alphabet[j] == word[i - 1] || ret.push(word.slice(0, i) + alphabet[j] + word.slice(i, l));
      return ret;
    };
    fn.remove = function(word){
      var ret = [], l = word.length;
      word = word.toLowerCase();
      for(var i = 0; i < l; i++)
        word[i + 1] == word[i] || ret.push(word.slice(0, i) + word.slice(i + 1, l));
      return ret;
    };
    fn.alter = function(word){
      var ret = [], l = word.length, m = alphabet.length;
      word = word.toLowerCase();
      for(var i = 0; i < l; i++)
        for(var j = 0; j < m; j++)
          alphabet[j] == word[i] || ret.push(word.slice(0, i) + alphabet[j] + word.slice(i + 1, l));
      return ret;
    };
    fn.transpose = function(word){
      var ret = [], l = word.length;
      word = word.toLowerCase();
      for(var i = 0; i < l - 1; i++)
        word[i + 1] == word[i] || ret.push(word.slice(0, i) + word[i + 1] + word[i] + word.slice(i + 2, l));
      return ret;
    };
    return fn;
  }();
  
  var know_edit = function(word, words){
    var edits = edit(word), res = [];
    words = words || {};
    for(var i = 0, l = edits.length; i < l; i++){
      edits[i] in words && res.push(edits[i]);
    }
    return res;
  };
  
  var check = function(word){
    var res = [], edits, depth = 2;
    if(word <= 2 || word in words){
      res.push(word);
    }else{
      res = know_edit(word, words);
      if(!res.length){
        edits = edit(word);
      }
    }
    return res;
  };
  
  exports.edit = {
    train: train,
    edit: edit,
    check: check
  };
})(typeof exports == 'undefined' ? window : exports)