var 
//代表所有学生的集合
students=(localStorage.stu)?(JSON.parse(localStorage.stu)):[],
//表格 tbody
$tbody=document.querySelector('.table tbody'),
//添加按钮
$add=document.querySelector('.add'),
//删除按钮
$remove=document.querySelector('.remove'),
//个选 反选按钮
$toggleCheck=document.querySelector('.tg-check');
$thead=document.querySelector('thead');
$tips=document.querySelector('.tips');
//添加一个学生
 $add.onclick=function(){
    //数据
    var xuehao=(students.length)?(students[students.length-1].id+1):1001;

    var stu={id:xuehao,name:'',sex:'',age:'',jiguan:''};
    //把一个新学生放到数据中
    students.push(stu);
    localStorage.stu=JSON.stringify(students);
    //把新学生放到页面中
    var tr=document.createElement('tr');
    // el.setAttribute('data-id',stu.id);
    tr.innerHTML='<td>'+stu.id+'</td><td data-role="name">'+stu.name+'</td><td data-role="sex">'+stu.sex+'</td><td data-role="age">'+stu.age+'</td><td data-role="jiguan">'+stu.jiguan+'</td><td><input type="checkbox" value="'+stu.id+'" class="ck"></td>'
    $tbody.appendChild(tr);
    toggleEdit(tr);
}
//添加一个学生结束

//根据数据把学生数据绘制出来
var render=function(){
        for(var i in students){
        var stu=students[i];
        //界面
        var $tr=document.createElement('tr');
        $tr.setAttribute('data-id',stu.id);     
        $tr.innerHTML='<td>'+stu.id+'</td><td data-role="name">'+stu.name+'</td><td data-role="sex">'+stu.sex+'</td><td data-role="age">'+stu.age+'</td><td data-role="jiguan">'+stu.jiguan+'</td><td><input type="checkbox" value="'+stu.id+'" class="ck"></td>';
        $tbody.appendChild($tr);
       }
    }
    render();
//渲染数据结束

//删除学生开始
var deleteStudent=function(xuehao){
        xuehao=Number(xuehao);
        var r=[];
        for( var i in students){
            var v=students[i];
            if(v.id!==xuehao){
                r.push(v)
            }
        }
        students=r;
        localStorage.stu=JSON.stringify(students);
    }

$remove.onclick=function(){
        var els=$tbody.querySelectorAll('.ck');
        for(var i=0,el;i<els.length;i++){
            el=els[i];
            if(el.checked){
                $tbody.removeChild(el.parentElement.parentElement);
                deleteStudent(el.value);
            }
        }$toggleCheck.checked=false;
    }
//删除学生结束 
//实现点击全选或反选
$toggleCheck.onclick=function(e){
        var els=$tbody.querySelectorAll('.ck');
        for(var i=0,el;i<els.length;i++){
            el=els[i];
            el.checked=this.checked;
        }
    }
//处理每个用户点到的td的情况(让tr变可编辑)       
            var ckhandler=function(){
                var els=$tbody.querySelectorAll('.ck')
                for(var i=0,el,j=0;i<els.length;i++){
                    el=els[i];
                    if(el.checked){
                        j+=1;
                    }
                }
                $toggleCheck.checked=(j===students.length);
            }          
//在tbody身上添加事件委派充到一个分发器  
$tbody.onclick=function(e){
        var el=e.target;
        var xuehao=Number(this.parentElement.parentElement.getAttribute('data-role'))
        if(el.classList.contains('ck')){
        	ckhandler.call(el,e);   
 
        }else if(el.nodeName==='TD'){
            if($tbody.querySelector('.editing')){
                    toggleEdit($tbody.querySelector('.editing'));
        }
        toggleEdit(el.parentElement);
    }
}
//删除学生及其相关功能结束
//编辑学生信息开始


//当tr处于不可编辑状态时让它可编辑;否则不可编辑
var toggleEdit=function(tr){
        var els=tr.querySelectorAll('td[data-role]');
        if(tr.classList.contains('editing')){
            for(var i=0,el,tmp;i<els.length;i++){
            el=els[i];
            tmp=el.querySelector('input').value;
            el.innerHTML=tmp;
          }
          tr.classList.remove('editing');           
                           
        }else{
             for(var i=0,el,tmp;i<els.length;i++){
                    el=els[i];
                    tmp=el.innerHTML;
                    el.innerHTML='<input type="text" value='+tmp+'>';
                }
                el.querySelector('input').focus();                
                tr.classList.add('editing');  
        }
    }
    var updatestudents=function(xuehao,key,value){
        console.table(students)
        xuehao=Number(xuehao);
        for(var i=0;i<students.length;i++){
            if(students[i].id===xuehao){
                students[i][key]=value;
            }
        }
        // console.table(students)
        //数据存储
        localStorage.students=JSON.stringify(students);
        $tips.innerHTML='保存成功';

    }


    var timeId;
    $tbody.onkeyup=function(e){
        var el=e.target;
        var xuehao,key,value;
        xuehao=el.parentElement.parentElement.getAttribute("data-id");
        key=el.parentElement.getAttribute("data-role");
        value=el.value;
        $tips.innerHTML='正在保存.....';
        clearTimeout(timeId);
        timeId=setTimeout(function(){
            updatestudents(xuehao,key,value)
        },10);
    }

    
    $thead.onclick=function(e){
           var el=e.target;
            if(el.hasAttribute('data-role')){
                var sortKey=el.getAttribute('data-role');
                var state=(el.getAttribute('flag')==='true')?true:false;
                el.setAttribute('flag',!state);
                // if(state){
                //     students.sort(function(x,y){
                //         return x[sortKey]<y[sortKey];
                //     })
                // }else{
                //     students.sort(function(x,y){
                //         return x[sortKey]>y[sortKey];
                //     })
                // }
                students=students.sort(function(x,y){
                    return state ?(x[sortKey]<y[sortKey]):(x[sortKey]<y[sortKey]);
                })
                render();
                localStorage.setItem('students',JSON.stringify(students));
            }
        }