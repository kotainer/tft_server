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
            'lastname',
            'email',
            'phone',
            'createdAt',
            'isBanned',
            'city',
            'address',
            'skype',
            'avatar',
            'cardNumber'
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

    order: {
        populate: '',
        fields: [
            'createdAt',
            'shop',
            'total',
            'cashback',
            'status',
            'purpose',
            'fiscalDate'
        ],
        searchOr: [],
        sort: '-createdAt',
        countLimit: 10,
        extendQuery: {},
        filePath: ''
    },

};
