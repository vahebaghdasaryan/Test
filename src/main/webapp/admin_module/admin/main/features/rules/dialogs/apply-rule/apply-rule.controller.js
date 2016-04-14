(function() {
    'use strict';

    angular.module('implHit.admin')
        .controller('ApplyRuleController', ApplyRuleController);

    ApplyRuleController.$inject = ['$scope', '$uibModalInstance', 'ruleService', 'eventService', 'EventTypes'];

    function ApplyRuleController($scope, $uibModalInstance, ruleService, eventService, EventTypes) {
        var self = this;

        self.rule = $scope.rule;
        self.ruleName = self.rule.title;

        self.cancel = cancel;
        self.submit = submit;


        function cancel(){
            $uibModalInstance.dismiss('cancel');
        }

        function submit(){
            ruleService.applyRule(self.rule.id)
                .then(function(){
                    eventService.sendEvent(EventTypes.ALERT_INFO, 'Rule successfully applied');
                    $uibModalInstance.close();
                })
                .catch(function(error){
                    console.error(error);
                    eventService.sendEvent(EventTypes.ALERT_WARNING, 'Something goes wrong');
                });
        }
    }
})();