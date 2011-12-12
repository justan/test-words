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
      //TODO(http://stevehanov.ca/blog/index.php?id=120)
      succinct: (function(){
        var BASE64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_',
          fix = ['', '0', '00', '000', '0000', '00000'],
          encode = function(trie){
            var key, bits = '10', dic = '', map = [trie], next, n = 0;
            while(map.length){
              next = [];
              map.forEach(function(cur){
                var keybit;
                for(key in cur){
                  if(key !== '$'){
                    next.push(cur[key]);
                    bits += '1';
                    keybit = (key.charCodeAt(0) - 'a'.charCodeAt(0)).toString(2);
                    keybit = fix[5 - keybit.length] + keybit;
                    dic = dic + (cur[key] && cur[key]['$'] ? '1' : '0') + keybit;
                  }
                }
                n++;
                bits += '0';
              });
              map = next;
            }
            bits = bits + '111111' + dic;
            return {
              len: n,
              //dic: dic,//bit.encode(dic),//
              tri: bit.encode(bits)//bits//
            };
          },
          bit = {
            encode: function(bits, lenth){
              bits = bits + '', W = 6;
              var strs = '', i = 0, n = Math.ceil(bits.length / W), _x = bits.length % W;
              bits = _x ? (bits + fix[6 - _x]) : bits;
              for(; i < n; i++){
                strs += BASE64[parseInt(bits.substring(i*W, (i + 1)*W), 2)];
              }
              return strs;
            },
            decode: function(str, len){
              var bits = '', letter;
              for(var i = 0, l = str.length; i < l; i++){
                letter = BASE64.indexOf(str[i]).toString(2);
                letter = bits.length >= len ? (fix[6 - letter.length] + letter) : letter;
                bits += letter;
              }
              return bits;
            }
          },
          
          rank = function(x, bits){
            
          },
          select = function(y, bits){
            
          };
        decode = bit.decode;
        var ret = {
          init: function(strs){
            var trie = {};
            strs.sort().forEach(function(word){
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
            return encode(trie);
          },
          has: function(word, data){
            var i = 0, l = word.length, cur = data,
              bits = cur.tri;
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