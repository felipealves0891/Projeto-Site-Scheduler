angular.module("scheduler",[]);
angular.module("scheduler").controller("schedulerCtrl",function($scope,$filter){
    let Notify = function(message){
        var msg = new SpeechSynthesisUtterance(message);
        window.speechSynthesis.speak(msg);
        if(!("Notification" in window)){
            return false;
        }
        else if(Notification.permission === "granted"){
            var notification = new Notification(message);
        }
        else{
            return false;
        }
    }
    let getStorage = function(){
        if(localStorage.length <= 0) return [];
        for(var nameOfProperty in localStorage){
            if(nameOfProperty === 'schedules') return JSON.parse(localStorage.schedules); 
        }
        return [];
    }
    let setStorage = function(schedules){
        localStorage.removeItem("schedules"); 
        localStorage.setItem("schedules",JSON.stringify(schedules));
    }
    $scope.schedules = getStorage();
    let schedulingExists = function(register){
        return $scope.schedules.some(function(scheduling){
            return scheduling.name == register.name;
        });
    }
    let schedulingDate = function(interval){
        let now = new Date();
        now.setHours(now.getHours() + interval.getHours());
        now.setMinutes(now.getMinutes() + interval.getMinutes());
        return now;
    }
    let generateIdentifier = function(){
        let greaterCode = 1;
        $scope.schedules.forEach(element => {
            if(element.identifier >= greaterCode) greaterCode = element.identifier + 1;
        });
        return greaterCode;
    }
    let convertDate = function(dateConverted){
        let strDate = $filter('date')(dateConverted,'yyyy-MM-dd HH:mm:ss.sss');
        let date = new Date(strDate);
        if(isNaN(date)) return new Date();
        return date;
    }
    $scope.saveScheduling = function(register){
        if(schedulingExists(register)){
            alert("O agendamento já existe!");
            return;
        };
        let scheduling = {
            "identifier" : generateIdentifier(),
            "name": register.name,
            "schedulingDate": schedulingDate(register.interval),
            "reschedule" : false,
            "interval": register.interval,
            "created": new Date(),
            "selected": false
        }; 
        $scope.schedules.push(scheduling);
        setStorage($scope.schedules);
        delete register.name;
        delete register.interval;
    }
    $scope.deleteScheduling = function(){
        $scope.schedules = $scope.schedules.filter(function(scheduling){
                return !scheduling.selected;
        });
        setStorage($scope.schedules);
    }
    $scope.isSelectedSchedule = function(){
        return $scope.schedules.some(function(scheduling){
            return scheduling.selected;
        });
    }
    $scope.reschedule = function(){
        $scope.schedules.forEach(function(scheduling){
            if(scheduling.reschedule == false) return;
            let interval =convertDate(scheduling.interval);
            scheduling.schedulingDate = schedulingDate(interval);
        });
        setStorage($scope.schedules);
    }
    $scope.isReschedule = function(){
        return $scope.schedules.some(function(scheduling){
            return scheduling.reschedule;
        });
    }
    let executionAlert = function(scheduling){
        let message = "A tarefa " + scheduling.name + ", deve ser executada!";
        if(Notify(message) == false) alert(message);
        if(scheduling.reschedule) scheduling.schedulingDate = schedulingDate(convertDate(scheduling.interval));
        if(scheduling.reschedule == false) scheduling.selected = true;
        $scope.deleteScheduling();
    }
    let timer = function(waitingTimer){
        setInterval(function(){
            $scope.schedules.forEach(function(scheduling){
                let executionDate = convertDate(scheduling.schedulingDate);
                let now = new Date();
                if(executionDate.getTime() <= now.getTime()){
                    executionAlert(scheduling);
                    setStorage($scope.schedules);
                    $scope.$apply();
                } 
            });
        },waitingTimer);
    }
    timer(1000);
});