/**
 * Created by 麦兜 on 2018/7/26.
 */
;(function(){
    window.ms={
        set:set,
        get:get
    }
    function set(key,val){
        localStorage.setItem(key,JSON.stringify(val))
    }
    function get(key){
        var json=localStorage.getItem(key);
        if(json){
            return JSON.parse(json);
        }
    }
})();
