/**
  * 编辑距离js示例
  */
(function(exports){
  var edit = function (){
    var alphabet = 'abcdefghijklmnopqrstuvwxyz';
    var fn = function edit(word){
      var ret = [];
      return ret.concat(fn.insert(word)).concat(fn.remove(word)).concat(fn.alter(word)).concat(fn.transpose(word));
    };
    fn.insert = function(word){
      var ret = [], l = word.length, m = alphabet.length, i, j;
      word = word.toLowerCase();
      for(i = 0; i < l + 1; i++)
        for(j = 0; j < m; j++)
          alphabet[j] == word[i - 1] || ret.push(word.slice(0, i) + alphabet[j] + word.slice(i, l));
      return ret;
    };
    fn.remove = function(word){
      var ret = [], l = word.length, i;
      word = word.toLowerCase();
      for(i = 0; i < l; i++)
        word[i + 1] == word[i] || ret.push(word.slice(0, i) + word.slice(i + 1, l));
      return ret;
    };
    fn.alter = function(word){
      var ret = [], l = word.length, m = alphabet.length, i, j;
      word = word.toLowerCase();
      for(i = 0; i < l; i++)
        for(j = 0; j < m; j++)
          alphabet[j] == word[i] || ret.push(word.slice(0, i) + alphabet[j] + word.slice(i + 1, l));
      return ret;
    };
    fn.transpose = function(word){
      var ret = [], l = word.length, i;
      word = word.toLowerCase();
      for(i = 0; i < l - 1; i++)
        word[i + 1] == word[i] || ret.push(word.slice(0, i) + word[i + 1] + word[i] + word.slice(i + 2, l));
      return ret;
    };
    return fn;
  }();
  
  
  var words = (function(){
    var types = {
      _default: 'hash', 
      plain: {
        init: function(strs){
          return ' ' + strs.join(' ') + ' '
        },
        has: function(word, data){
          //return new RegExp('^' + word + '$', 'm').test(data);
          return data.indexOf(' ' + word + ' ') != -1;
        }
      },
      hash: {
        init: function(strs){
          var hash = {};
          strs.forEach(function(word){
            hash[word] = 1;
          });
          return hash
        }, 
        has: function(word, data){
          return data[word];
        }
      },
      trie: {
        init: function(strs){
          var trie = {};
          strs.forEach(function(word){
            var i = 0, l = word.length, cur = trie;
            for(; i < l; i++){
              if(cur[word[i]]){
                cur = cur[word[i]];
              }else{
                cur = cur[word[i]] = {};
              }
            }
            cur['$'] = 1;
          });
          return trie;
        }, 
        has: function(word, data){
          var i = 0, l = word.length, cur = data;
          for(; i < l; i++){
            cur = cur[word[i]];
            if(!cur){
              return false;
            }
          }
          return cur['$'];
        }
      },
      'succinct': (function(){
        var BASE64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_',
          encode = function(trie){
            var cur = trie, key, i, code = '', map = [cur], map_tmp;
            while(map.length){
              map_tmp = []
              map.forEach(function(cur){
                i = 0;
                for(key in cur){
                  key == '$' || tmp.push(cur[key])
                  i++;
                }
                code += i.toString(2);
              });
              map = tmp;
            }
          },
          decode = function(str){},
          rank = function(){},
          select = function(){};
        var ret = {
          init: function(strs){
            var trie = {};
            strs.forEach(function(word){
              var i = 0, l = word.length, cur = trie;
              for(; i < l; i++){
                if(cur[word[i]]){
                  cur = cur[word[i]];
                }else{
                  cur = cur[word[i]] = {};
                }
              }
              cur['$'] = 1;
            });
            return trie;
          },
          has: function(word, data){
            var i = 0, l = word.length, cur = data;
            for(; i < l; i++){
              cur = cur[word[i]];
              if(!cur){
                return false;
              }
            }
            return cur['$'];
          }
        }
        return ret;
      })(),
      binary: {
        init: function(strs){
          var ret = [];
          strs.sort().forEach(function(word){
            var l = word.length;
            ret[l] = (ret[l] || '') + word;
          });
          return ret;
        }, 
        has: function(word, data){
          var l = word.length, strs = data[l], n, start, m, end, res;
          if(strs){
            n = strs.length/l;
            start = 0, end = n, m = Math.floor(end/2);
            while(end >= start){
              res = strs.substring((m - 1)*l, m*l);
              if(res == word){
                return true;
              }else if(res > word){
                end = m - 1, m = Math.floor((end + start)/2);
              }else if(res < word){
                start = m + 1, m = Math.floor((end + start)/2);
              }
            }
            return false;
          }else{
            return false;
          }
        }
      }
    };
    
    var fn = function words(strs, type){
      type = types.hasOwnProperty(type) ? type : types['_default'];
      this.type = type;
      this.data = types[type]['init'](strs);
    };
    fn.prototype = {
      check: function(word){
        var res = [], edits, depth = 2;
        if(word.length <= 2 || this.get(word)){
          res.push(word);
        }else{
          res = this.know_edit(word);
          if(!res.length){
            edits = edit(word);
          }
        }
        return res;
      },
      get: function(word){
        return types[this.type]['has'](word, this.data);
      },
      know_edit: function(word, depth){
        var edits = edit(word), res = [], i, l;
        for(i = 0, l = edits.length; i < l; i++){
          this.get(edits[i]) && res.push(edits[i]);
        }
        return res;
      }
    };
    return function(strs, type){
      return new fn(strs, type);
    };
  })();
  
  exports.edit = {
    words: words,
    edit: edit
  };
})(typeof exports == 'undefined' ? window : exports);