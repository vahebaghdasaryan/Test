(function() {
    'use strict';

    angular.module('implHit.admin')
        .controller('DeleteRuleController', DeleteRuleController);

    DeleteRuleController.$inject = ['$scope', '$uibModalInstance', 'ruleService', 'eventService', 'EventTypes'];

    function DeleteRuleController($scope, $uibModalInstance, ruleService, eventService, EventTypes) {
        var self = this;

        self.rule = $scope.rule;
        self.ruleName = self.rule.title;

        self.cancel = cancel;
        self.submit = submit;


        function cancel(){
            $uibModalInstance.dismiss('cancel');
        }

        function submit(){
            ruleService.deleteRule(self.rule.id)
                .then(function(){
                    eventService.sendEvent(EventTypes.ALERT_INFO, 'Rule successfully deleted');
                    $uibModalInstance.close();
                })
                .catch(function(error){
                    console.error(error);
                    eventService.sendEvent(EventTypes.ALERT_WARNING, 'Something goes wrong');
                });
        }
    }
})();