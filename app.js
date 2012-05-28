$(document).ready(function() {
    var UserModel = Backbone.Model.extend({
        userName:""
    });

    var UserView = Backbone.View.extend({
        tagName: 'div',
        initialize: function(){
            var _this = this;
            _.bindAll(this);
        },
        events: {
            'click .userViewName': 'userViewDetail',
            'click .userViewdelete': 'userViewDelete',
            'modifyUserModel': 'modifyUserModel'
        },
        render: function() {
            var _this = this;
            console.log("UserView render _this:", _this);
            console.log("afdsfdsfsdfdf", _this.model.cid);
            $(_this.el).empty();
            $( "#userViewTemplate" ).tmpl({userViewName: _this.model.get("userName")}).appendTo(_this.el);
            return _this;
        },
        userViewDelete: function() {
            var _this = this;
            console.log("UserView userViewDelete _this: ", _this);
            var isConfirmed = confirm("是否删除用户");
            if (isConfirmed) {
                //向服务器发送请求，如果成功则
                $(_this.el).remove();
//                $(".app").trigger("delete");
            }
        },
        userViewDetail: function() {
            var _this = this;
            console.log("UserView userViewDetail", _this.model);
            appView.userDetailView.modify(_this.model);
        },
        modifyUserModel: function(event, arg) {
            console.log("收到通知");

            var _this = this;
            if (_this.model.cid == arg.model.cid) {
                _this.model = arg.model;
                _this.render();
            }
        }
    });

    var UserCollection = Backbone.Collection.extend({
        model:UserModel
    });

    var UserCollectionView = Backbone.View.extend({
        tagName:'div',
        initialize: function(){
            var _this = this;
            _.bindAll(_this);
            _this.collection = new UserCollection();
            _this.collection.on('add', this.add);
        },
        render: function() {
            var _this = this;
            $(_this.el).empty();
            return _this;
        },
        add: function(userModel) {
            var _this = this;
            var userView = new UserView();
            userView.model = userModel;
            $(_this.el).append(userView.render().el);
        }
    });

    var UserDetailView = Backbone.View.extend({
        tagName:'div',
        initialize: function(){
            var _this = this;
            _.bindAll(_this);
            _this.state = "add";
            _this.model = null;
            return _this;
        },
        events: {
            'click .confirmButton': 'confirm'
        },
        render: function() {
            var _this = this;
            console.log("UserDetailView render _this:", _this);
            $(_this.el).empty();
            $( "#userDetailViewTemplate" ).tmpl().appendTo(_this.el);
            return _this;
        },
        confirm: function() {
            var _this = this;
            if (_this.state == "add") {
                appView.userCollectionView.collection.add({userName:$(".userDetailViewName").val()});
            } else if (_this.state == "modify") {
                console.log("哈哈: ", _this.model);
                _this.model.set({userName: $(".userDetailViewName").val()});
                console.log("哈哈22: ", _this.model);
                $("div").trigger("modifyUserModel", {model: _this.model});
                _this.state = "add";
                $(".confirmButton").html("加入");
            }
            $(".userDetailViewName").val("");
        },
        modify: function(userModel) {
            console.log("jiangpeng: ", userModel);
            var _this = this;
            _this.state = "modify";
            _this.model = userModel;
            $(".userDetailViewName").val(userModel.get("userName"));
            $(".confirmButton").html("修改");
        }
    });

    var AppView = Backbone.View.extend({
        el:$('.app'),
        initialize: function(){
            var _this = this;
            _.bindAll(_this);
        },
        render: function() {
            var _this = this;
            console.log("AppView render _this: ", _this);
            var _this = this;
            $(_this.el).empty();
            _this.userDetailView = new UserDetailView();
            $(_this.el).append(_this.userDetailView.render().el);
            _this.userCollectionView = new UserCollectionView();
            $(_this.el).append(_this.userCollectionView.render().el);
            return _this;
        },
        events: {
        },
        getData: function(pageIndex) {
            var _this = this;
            var userModel = new UserModel({userName:"000"});
            _this.userCollectionView.collection.add(userModel);
        }
    });

    var appView = new AppView();
    appView.render();
    appView.getData(1);
});