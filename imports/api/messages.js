import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Messages = new Mongo.Collection('messages');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('messages', function messagesPublication() {
  	return Messages.find({$or:[{sender: this.userId},{receiver: this.userId}]});
  })
} 

Meteor.methods({
	'messages.insert' (text, receiver) {
    check(text, String);
    check(receiver, String);

    // Make sure the user is logged in before inserting a task
    if (!Meteor.userId()) {
    	throw new Meteor.Error('not-authorized');
    }
    const user = Meteor.users.findOne({username: receiver});
    console.log(user);

    Messages.insert({
    	text,
    	sendAt: new Date(),
    	sender: this.userId,
    	receiver: user._id
    });
  }
});
