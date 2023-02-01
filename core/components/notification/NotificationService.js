import NotificationEventBus from './NotificationEventBus';

const NotificationService = {
    add: message => {
        NotificationEventBus.$emit('add', message);
    },
    removeGroup: position => {
        NotificationEventBus.$emit('remove-group', position);
    },
    removeAllGroups: () => {
        NotificationEventBus.$emit('remove-all-groups');
    },
    set: () => {
        NotificationEventBus.$emit('set');
    },
};

export default NotificationService;
