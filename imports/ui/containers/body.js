import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Tasks } from '../../api/tasks.js';
import { Messages } from '../../api/messages.js';
import { Users } from '../../api/users.js';

import '../templates/task.js';
import '../templates/message.js';
import './body.html';


function setChatWindowHeight() {    
  $('#chat-window').height(window.innerHeight - $('#chat-header').outerHeight() - $('.new-message').outerHeight());
  console.log(window.innerHeight + "|" + $('#chat-header').outerHeight() + "|" + $('.new-message').outerHeight());
}

if (Meteor.isClient) {
    $( window ).resize(function() {
      setChatWindowHeight();  
    });
}

Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('tasks');
  Meteor.subscribe('messages');
  Meteor.subscribe('friends');
});

Template.body.helpers({
  tasks() {
    const instance = Template.instance();
    if (instance.state.get('hideCompleted')) {
      // If hide completed is checked, filter tasks
      return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
    }
    // Otherwise, return all of the tasks
    return Tasks.find({}, { sort: { createdAt: -1 } });
  },  
  incompleteCount() {
    return Tasks.find({ checked: { $ne: true } }).count();
  },
  messages() {
    const instance = Template.instance();
    if (instance.state.get('unselect')) {
      return ;
    } else {
      let id = instance.state.get('selected');
      return Messages.find({$or:[{sender: id},{receiver: id}]}); 
    }
  },
  friends() {
    return Meteor.users.find({_id: {$ne: Meteor.userId()}}).fetch();
  }
});
 
Template.body.events({
  'submit .new-task'(event) {
    // Prevent default browser form submit
    event.preventDefault();
 
    // Get value from form element
    const target = event.target;
    const text = target.text.value;
 
    // Insert a task into the collection
    Tasks.insert({
      text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username, // current time
    });

    Meteor.call('tasks.insert', text);
 
    // Clear form
    target.text.value = '';
  },
  'submit .new-message'(event) {
    // Prevent default browser form submit
    event.preventDefault();
 
    // Get value from form element
    const target = event.target;
    const text = target.text.value;
    const receiver = target.receiver.value;

    Meteor.call('messages.insert', text, receiver);
 
    // Clear form
    target.text.value = '';
  },
  'change .hide-completed input'(event, instance) {
    instance.state.set('hideCompleted', event.target.checked);
  },

  'click .friend'(event, instance) {
    const receiver = event.target.text.replace(/^\s+|\s+$/g, '');
    if (instance.state.get('selected')!=event.target.id) {
      $("#" + instance.state.get('selected')).removeClass("clicked");
      $("#" + event.target.id).addClass("clicked");
    }
    instance.state.set('selected', event.target.id);
    setChatWindowHeight();
    $("input#receiver").val(receiver);
    $("h1#friend-name").text(receiver);
  }
});