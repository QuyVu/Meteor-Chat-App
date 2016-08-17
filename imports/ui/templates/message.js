import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
 
import './message.html';

Template.message.helpers({
	isSender(sender) {
		console.log(Meteor.userId() + " " + sender);
		return Meteor.userId() === sender;
	},
  getUsername(id) {
    return Meteor.users.findOne({_id: id}).username;
  },
  displayTime(time) {
    return (time.getFullYear() + "-" + ("0" + (time.getMonth()+1)).slice(-2) + "-" + ("0" + time.getDate()).slice(-2) + "  " + time.getHours() + ":" + ("0" + time.getMinutes()).slice(-2) + ":" + ("0" + time.getSeconds()).slice(-2));
  },
});


