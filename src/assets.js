
import bridge from './bridge';

const assetSender = bridge.senderForService( 'asset' );

export default {
  getNext() {
    return assetSender({
      action: 'get-next'
    });
  },
  getList() {
    return assetSender({
      action: 'get-list'
    });
  }
};
