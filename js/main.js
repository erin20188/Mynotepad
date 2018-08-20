/**
 * Created by 麦兜 on 2018/7/26.
 */
(function(){
    var oAlert_music=document.getElementById('alert-music');
    new Vue({
        el:'#notepad',
        data:{
            noteList:[],
            current:{},
            nextid:0,
            add_detail:false,
            selectAll:false
        },
        mounted:function(){
            //获取数据
            var now=this;
            this.noteList=ms.get('noteList')||this.noteList;
            this.nextid=ms.get('nextid')||this.nextid;
            setInterval(function(){
                now.check_time();
            },1000);
        },
        methods:{
            //添加或者修改功能合二为一
            addModify:function(){
                var cur=this.current;
                var is_update=this.current.id;
                //修改功能
                if(is_update){
                    var index=this.find_index(is_update);
                    Vue.set(this.noteList,index,Object.assign({},cur));
                    //this.noteList[index]=Object.assign({},this.cur);
                }
                //添加功能
                else{
                    if(!cur.title&&cur.title!==0) return;
                    var now=Object.assign({},cur);
                    this.nextid++;
                    ms.set('nextid',this.nextid);
                    now.id=this.nextid;
                    this.noteList.unshift(now);
                }
                this.resetCur();
            },
            remove:function(id){
                var index=this.find_index(id);
                this.noteList.splice(index,1);
            },
            setCurrent:function(plan){
                this.current=Object.assign({},plan);
            },
            resetCur:function(){
                this.setCurrent({});
            },
            find_index:function(id){
               return this.noteList.findIndex(function(item){
                    return item.id==id;
                });
            },
            toggle_finish:function(id){
                var index=this.find_index(id);
                Vue.set(this.noteList[index],'finish',!this.noteList[index].finish);
            },
            check_time:function(){
                var now=this;
                this.noteList.forEach(function(val,index){
                    var alert=val.alertTime;
                    if(alert&& (!val.alert_confirmed)){
                        var alert_stamp=(new Date(alert)).getTime();
                        var now_time=(new Date()).getTime();
                        if(now_time>=alert_stamp){
                            oAlert_music.play();
                            var confirmed= confirm('完成 <'+val.title+'> 的时间到！');
                            Vue.set(now.noteList[index],'alert_confirmed',confirmed);
                            if(confirmed === true){
                                oAlert_music.pause();
                                oAlert_music.currentTime = 0;
                            }
                        }
                    }
                    else{return;}
                });
            },
            toggle_detail:function(id){
                var index=this.find_index(id);
                Vue.set(this.noteList[index],'show_detail',!this.noteList[index].show_detail);
            },
            toggle_add:function(){
                this.add_detail=!this.add_detail;
            },
            toggle_select:function(){
                if(this.selectAll==true){
                    for(var i=0;i<this.noteList.length;i++){
                        this.noteList[i].checkbox=false;
                    }
                }
                else{
                    for(var j=0;j<this.noteList.length;j++){
                        this.noteList[j].checkbox=true;
                    }
                }
            },
            deletePlan:function(){
                for(var i=this.noteList.length-1;i>=0;i--){
                    if(this.noteList[i].checkbox){
                        var index=this.noteList.indexOf(this.noteList[i]);
                        this.noteList.splice(index,1);
                    }
                }
            }
        },
        watch:{
            //保存在localStorage
            noteList:{
                deep:true,
                handler:function(new_val,old_val){
                    if(new_val){
                        ms.set('noteList',new_val);
                    }
                    else{
                        ms.set('noteList',[]);
                    }
                }
            }
        }
    })
})();
