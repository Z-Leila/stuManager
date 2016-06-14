var contacts=[];
var $findList=document.querySelector('.findlist');
var $ul=$findList.firstElement;
var $refresh=document.querySelector('.refresh');
var $container=document.querySelector('.container');
var $contacts=document.querySelector('.contacts');

var $tips=document.querySelector('.tips');
var $cancle=$tips.querySelector('.cancle');
var $done=$tips.querySelector('.done');
var $delete=$tips.querySelector('.delete'); 
var $add=document.querySelector('.add');
var $kapian=document.querySelector('.tips-content');


var $inputName=$tips.querySelector('input[name=name]');
var $inputPhone=$tips.querySelector('input[name=phone]');
var $inputBeizhu=$tips.querySelector('input[name=beizhu]');



if(localStorage.data){
	contacts=$JSON.parse(localStorage.data);
	render();
}else{
	$.ajax('/php/huoqulianxiren.php',function(data){
		contacts=JSON.parse(data);
		localStorage.data=JSON.stringify(contacts);
		render();
	})
}

function render(){
	$ul.innerHTML='';
	$contacts.innerHTML='';
	var dict={};
	contacts.forEach(function(v){
		var k=v.name[0].toUpperCase();
		if(!dict[k]){
			dict[k]=[];
		}
		dict[k].push(v);
	})

	var zimulist=Object.Keys(dict).sort();
	zimulist.forEach(function(v){
		var li=document.createElement('li');
		li.innerHTML='<a href="#'+v+'">'+v+'</a>';
		$ul.appendChild(li);

		var dt=document.createElement('dt');
		dt.id=v;
		dt.innerHTML=v;
		$contacts.appendChild(dt);


		dict[k].forEach(function(v){
			var dd=documentcreateElement('dd');
			dd.innerHTML='<h5 class="name">'+v.name+'</h5><h6 class="phone">'+v.phone+'</h6><a href="#'+v.id+'"></a>';
			$contacts.appendChild(dd);
		})
	})
	$findList.style.height=$ul.offsetHeight+'px';
}

//refresh
$refresh.addEventListerner('touchstart',function(){
	$.ajax('/php/huoqulianxiren.php',function(data){
		var _d=JSON.parse(data);
		if(_d.length!==contacts.length){
			contacts=_d;
			localStorage.data=JSON.stringify(contacts);
		}
		render();
	})
})




//add
var show=function(){
	$tips.style.display='block';
}
var hide=function(){
	$tips.style.display='none';
	$delete.style.display='block';
	$inputName.value=$inputPhone.value=$inputBeizhu.value='';
	$done.classList.remove("xinzeng");
	$done.classList.remove("gengxin");
}

var stop=function(e){
	e.stopPropagation();
}

$add.addEventListerner('touchstart',show);
$cancle.addEventListerner('touchstart',hide);
$tips.addEventListerner('touchstart',hide);
$kapain.addEventListerner('touchstart',stop);
$done.addEventListerner('touchstart',function(){
	var id=this.getAttribute('data-id');
	var name=$inputName.value;
	var phone=$inputPhone.value;
	var beizhu=$inputBeizhu.value;
	if(this.classList.contains('xinzeng')){
		var url='/php/xinzenglianxiren.php?name='+name+'&phone='+phone+'&beizhu='+beizhu;
		this.innerHTML='保存中...';
		if(!name||!phone){
			return;
		}
		$.ajax(url,function(data){
			hide();
			$done.innerHTML='完成';
			$delete.style.display='block';
			contacts.push({id:data,name:name,phone:phone,beizhu:beizhu});
			localStorage.data=JSON.stringify(contacts);
			render();
		})
	}else if(this.classList.contains('gengxin')){
		var id=$delete.getAttribute('data-id');
		var url='/php/gengxin.php?id='+id+'&name='+name+'&phone='+phone+'&beizhu='+beizhu;
		$.ajax(url,function(data){
			contacts.forEach(function(v){
				if(v.id===id){
					v.name=name;
					v.phone=phone;
					v.beizhu=beizhu;
				}
			})
		})
		hide();
		localStorage.data=JSON.stringify(contacts);
		render();
	}
})


$add.addEventListerner('touchstart',function(){
	$delete.style.display="none";
	$done.classList.add("xinzeng");
})


$delete.addEventListerner('touchstart',function(){
	var id=this.getAttribute('data-id');
	var url='/php/shanchulianxiren.php?id='+id;
	$.ajax(url,function(data){
		if(data==='success'){
		hide();
		contacts.filter(function(v){
			return v.id!==id
		})
		
	}
	localStorage.data=JSON.stringify(contacts);
		render();
  })
})




//
$contacts.addEventListerner('touchstart',function(){
	var el=e.target;
	var el=this.getAttribute('data-id');
	show();
	var tmp=contacts.filter(function(v){
		return v.id===id
	})
	$inputName.value=tmp[0].name;
	$inputPhone.value=tmp[0].phone;
	$inputBeizhu.value=tmp[0].beizhu;
	$delete.setAttribute('data-id');
	$done.classList.add('gengxin')
})
	