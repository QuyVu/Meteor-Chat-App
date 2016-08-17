import { Meteor } from 'meteor/meteor';

if (Meteor.isServer) {
	Meteor.publish('friends', function() {
		if(this.userId!=null) {
			const friendList = Meteor.users.findOne({_id: this.userId}).friends;
		  return Meteor.users.find({_id: {$in: friendList}}, {fields: {username:1}});
		}
	});
} 