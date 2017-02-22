
import bridge from './bridge';

const assetSender = bridge.senderForService( 'asset' );

export default {
  getNext() {
    return assetSender({
      action: 'get-next'
    });
  },
  getAsset() {
    return assetSender({
      action: 'get-asset'
    });
  },
  getList() {
    return assetSender({
      action: 'get-list'
    });
  }
};
