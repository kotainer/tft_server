import {Document, model, Model, Schema} from 'mongoose';

import * as crate from 'mongoose-crate';
import * as LocalFS from 'mongoose-crate-localfs';
import * as ImageMagick from 'mongoose-crate-imagemagick';

const appRootDir = require('app-root-dir').get();
const uuid = require('uuid');

interface IShop extends Document {
    name: string;
    percent: number;
    oldId: number;
    fiscalFeature: string;

    attach(field: string, file: any, callback: any): any;
};

const schema = new Schema({
    _id: {
        type: String,
        default: uuid,
    },

    name: String,

    type: String,

    userId: String,

    oldId: Number,

    user: {
      login: String,
      _id: String
    },

    percent: {
      type: Number,
      default: 0
    },

    fiscalNumbers: [String],

    isActive: {
        type: Boolean,
        default: true
      },

    createdAt: {
        type: Date,
        default: Date.now()
    },
});

schema.plugin(crate, {
    storage: new LocalFS({
      directory: appRootDir + '/public/photos/users/',
      webDirectory: '/photos/users/'
    }),
    fields: {
      logo: {
        processor: new ImageMagick({
          tmpDir: appRootDir + '/tmp', // Where transformed files are placed before storage, defaults to os.tmpdir()
          formats: ['JPEG', 'GIF', 'PNG'], // Supported formats, defaults to ['JPEG', 'GIF', 'PNG', 'TIFF']
          transforms: {
            original: {
              // keep the original file
            },
            small: {
              resize: '75x75',
            },
            medium: {
              resize: '175x175',
            },
          }
        })
      }
    }
  });

const Shop = model<IShop>('Shop', schema);

export = Shop;
