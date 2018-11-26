/**
 * Created by Gaven on 17/4/12.
 */
var modifyUser = {};
var deleteUser = {};
var dic = {};
var relUrl = '/yxgl';
$(function () {



});

function createUser() {
    var params = $('#xjryForm').serialize();
    if(params.indexOf('name=&') > -1){
        alert('请填写姓名！');
        return;
    }
    $.post(relUrl+'/insertUser', params, function (data) {
        if(data.insertId > 0){
            //成功
            window.location.reload();
        }else{
            alert('提交失败！')
        }
    })
}

function queryUserById(id) {
    $('#ryFormModify input').val('');
    $.post(relUrl+'/queryUserById', {id: id}, function (data) {
        if(data && data.length>0){
            var user = data[0];
            modifyUser = user;
            $('#inputIDModify').val(user.id);
            $('#inputGHModify').val(user.employee_id);
            $('#inputXMModify').val(user.name);
            $('#inputGWModify').val(user.business);
            $('#inputSZDModify').val(user.address);
            $('#inputDYCBModify').val(user.cost);
            $('#inputLXFSModify').val(user.phone);
        }
    })
}

function updateUser() {
    modifyUser.employee_id = $('#inputGHModify').val();
    modifyUser.name = $('#inputXMModify').val();
    modifyUser.business = $('#inputGWModify').val();
    modifyUser.address = $('#inputSZDModify').val();
    modifyUser.cost = $('#inputDYCBModify').val();
    modifyUser.phone = $('#inputLXFSModify').val();
    $.post(relUrl+'/updateUser', modifyUser, function (data) {
        console.log(data);
        if(data.changedRows > 0){
            //成功
            window.location.reload();
        }else{
            alert('提交失败！')
        }
    });
}

function setDelUserId(id) {
    deleteUser.id = id;
}

function deleteUserById() {
    $.post(relUrl+'/deleteUserById', deleteUser, function (data) {
        if(data.changedRows > 0){
            //成功
            window.location.reload();
        }else{
            alert('删除失败！')
        }
    });
}

function setDicType(type) {
    dic.type = type;
}
function setDelDicId(id) {
    dic.id = id;
}

function createDic() {
    var name = $('#inputDicName').val();
    if(name.length < 1){
        alert('请填写名称！');
        return
    }
    $.post(relUrl+'/insertDic', {type: dic.type, name: name}, function (data) {
        if(data.insertId > 0){
            //成功
            window.location.reload();
        }else{
            alert('提交失败！')
        }
    })
}

function queryDicById(id) {
    $('#inputDicIDModify, #inputDicNameModify').val('');
    $.post(relUrl+'/queryDicById', {id: id}, function (data) {
        if(data && data.length>0){
            var dicData = data[0];
            dic = dicData;
            $('#inputDicIDModify').val(dicData.id);
            $('#inputDicNameModify').val(dicData.name);
        }
    })
}

function updateDic() {
    dic.id = $('#inputDicIDModify').val();
    dic.name = $('#inputDicNameModify').val();
    $.post(relUrl+'/updateDic', dic, function (data) {
        if(data.changedRows > 0){
            //成功
            window.location.reload();
        }else{
            alert('提交失败！')
        }
    })
}

function deleteDicById() {
    $.post(relUrl+'/deleteDicById', dic, function (data) {
        if(data.affectedRows > 0){
            //成功
            window.location.reload();
        }else{
            // alert('删除失败！')
        }
    });
}

