
export class Payments {

    listMy = async (ctx) => {
        ctx.extendQuery = {
            'user._id': ctx.user._id
        }
    }
}
