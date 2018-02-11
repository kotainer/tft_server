export default {
    clearExmpl: {
        populate: '',
        fields: [],
        searchOr: [],
        sort: '',
        countLimit: 10,
        extendQuery: {},
        filePath: ''
    },

    user: {
        populate: 'parent',
        fields: [
            'login',
            'name',
            'surname',
            'lastName',
            'email',
            'phone',
            'createdAt',
            'isBanned',
            'city',
            'address',
            'skype',
            'avatar'
        ],
        searchOr: [
            'name',
            'surname',
            'login',
            'email',
            'phone',
            'city'
        ],
        sort: '-createdAt',
        countLimit: 20,
        filePath: 'user'
    },

    userForAdmin: {
        populate: '',
        fields: [
            'login',
            'name',
            'surname',
            'lastName',
            'email',
            'phone',
            'createdAt',
            'isBanned',
            'sity',
            'address',
            'skype',
            'emailIsConfirmed',
            'avatar'
        ],
        searchOr: [
            'name',
            'surname',
            'login',
            'email',
            'phone'
        ],
        sort: '-createdAt',
        countLimit: 10,
        filePath: 'user'
    },

    admin: {
        populate: '',
        fields: '',
        searchOr: [],
        sort: '',
        countLimit: 10,
        filePath: 'admin'
    },

    settings: {
        populate: '',
        fields: '',
        searchOr: [],
        sort: '',
        countLimit: 10,
    },

    post: {
        populate: '',
        fields: [
            'title',
            'body',
            'ifQuestionary',
            'images',
            'questionary',
            'reactions',
            'tags',
            'questionaryResult',
            'reactionsResults',
            'createdAt',
            'telegramUrl'
        ],
        searchOr: [],
        sort: '-createdAt',
        countLimit: 10,
        extendQuery: {
            isVisible: true
        },
        filePath: 'post'
    },

    postsForAdmin: {
        populate: '',
        fields: [
            'title',
            'body',
            'ifQuestionary',
            'images',
            'questionary',
            'reactions',
            'tags',
            'createdAt',
            'questionaryResult',
            'telegramUrl'
        ],
        searchOr: [],
        sort: '-createdAt',
        countLimit: 10,
        extendQuery: {},
        filePath: 'post'
    },

    comment: {
        populate: 'user',
        populateSelect: 'name lastName surname email avatar',
        fields: [
            'body',
            'createdAt',
            'user'
        ],
        searchOr: [],
        sort: '-createdAt',
        countLimit: 10,
        extendQuery: {},
        filePath: 'comment'
    },

    tokenRate: {
        populate: '',
        fields: [],
        searchOr: [],
        sort: '',
        countLimit: 10,
        extendQuery: {},
        filePath: ''
    },
};
