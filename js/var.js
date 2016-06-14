var arr=[];
	var forEach=arr.forEach;
	var
	$tbody=document.querySelector('.table tbody'),
	$add=document.querySelector('.add'),
	$remove=document.querySelector('.remove'),
	$toggleCheck=document.querySelector('.tg-check'),
	students=(localStorage.students)? (JSON.parse(localStorage.students)):[];

	$add.addEventListener('click',function(){
		var xuehao=(students.length)? (students[students.length-1].id+1):10001;
		var stu={id:xuehao,name:'',sex:'',age:'',jiguan:''};
		students.push(stu);
		localStorage.students=JSON.stringify(students);
		var tr=document.createElement('tr');
		tr.innerHTML='<td>'+stu.id+'</td><td data-role="name">'+stu.name+'</td><td data-role="sex">'+stu.sex+'</td><td data-role="age">'+stu.age+'</td><td data-role="jiguan">'+stu.jiguan+'</td><td><input type="checkbox" value="'+stu.id+'" class="ck"></td>';
		tr.setAttribute('data-id',stu.id);
		$tbody.appendChild(tr);
		toggleEdit(tr);
		
	})

	var render=function(){
		$tbody.innerHTML='';
		students.forEach(function(v){
			var stu=v;
			var tr=document.createElement('tr');
			tr.innerHTML='<td>'+stu.id+'</td><td data-role="name">'+stu.name+'</td><td data-role="sex">'+stu.sex+'</td><td data-role="age">'+stu.age+'</td><td data-role="jiguan">'+stu.jiguan+'</td><td><input type="checkbox" value="'+stu.id+'" class="ck"></td>';
			tr.setAttribute('data-id',stu.id);
			$tbody.appendChild(tr);
		})
	}
	render();
	$remove.addEventListener('click',function(){
		var els=$tbody.querySelectorAll('.ck');
		forEach.call(els,function(v){
			if(v.checked){
				$tbody.removeChild(v.parentElement.parentElement);
				deletestudent(v.value);
			}
		})
		$toggleCheck.checked=false
	})

	var deletestudent=function(xuehao){
		xuehao=Number(xuehao);
		var r=[];
		students.forEach(function(v){
			if(v.id!==xuehao){
				r.push(v);
			}
		})
		students=r;
		localStorage.students=JSON.stringify(students);
	}

	$toggleCheck.addEventListener('click',function(){
		// console.log($togglecheck.checked)
		var els=$tbody.querySelectorAll('.ck');
		forEach.call(els,function(v){
			v.checked=$toggleCheck.checked;
		})
	})
	$tbody.addEventListener('click',function(e){
		var el=e.target;
		if(el.classList.contains('ck')){
			ckhandler.call(el,e);
		}else if(el.nodeName==='TD'){
			edithandler.call(el,e);
		}
	})
	var ckhandler=function(){
		var els=$tbody.querySelectorAll('.ck');
		var j=0;
		forEach.call(els,function(v){
			if(v.checked){
				j+=1;
			}
		})
		$toggleCheck.checked=(j===students.length)
	}
	var edithandler=function(){
		var els=$tbody.querySelectorAll('.editing');
		forEach.call(els,function(v){
			toggleEdit(v);
		})
		toggleEdit(this.parentElement)
	}

	var toggleEdit=function(tr){
		var els=tr.querySelectorAll("td[data-role]");
		if(tr.classList.contains('editing')){
			forEach.call(els,function(v){
				var tmp=v.querySelector('input').value;
				v.innerHTML=tmp;
			})
			tr.classList.remove('editing');
		}else{
			tr.classList.add('editing');
			forEach.call(els,function(v){
				var tmp=v.innerHTML;
				v.innerHTML='<input type="text" value="'+tmp+'">';
			})
			els[0].querySelector('input').focus();
		}
	}
	var tips=document.querySelector('.tips');
	var timerId;
	$tbody.addEventListener('keyup',function(e){
		var el=e.target;
		var xuehao=Number(el.parentElement.parentElement.getAttribute('data-id'));
		var key=el.parentElement.getAttribute('data-role');
		var value=el.value;
		tips.innerHTML='正在保存...';
		clearTimeout(timerId);
		timerId=setTimeout(function(){
			updatestudent(xuehao,key,value);
		},200);
	})

	var updatestudent=function(id,k,value){
		id=Number(id);
		forEach.call(students,function(v){
			if(v.id===id){
				v[k]=value;
			}
		})
		localStorage.students=JSON.stringify(students);
		tips.innerHTML='保存成功';
	}

	var $thead=document.querySelector('.table thead');
	$thead.addEventListener('click',function(e){
		var el=e.target;
		if(el.hasAttribute('data-role')){
			var sortkey=el.getAttribute('data-role');
			var state=(el.getAttribute('flag')==='true')? true:false;
			el.setAttribute('flag',!state);
			students=students.sort(function(x,y){
				return state? (x[sortkey] < y[sortkey]):
							  (x[sortkey] < y[sortkey]);
			})
			render();
		}
	})