import nfc
import hashlib
import base58
from bip_utils import Bip44, Bip44Coins
from bip_utils import WifEncoder

byte_seed = None

def private_key_to_wif(private_key):
    prefix = b'\x80' + private_key
    sha256_1 = hashlib.sha256(prefix).digest()
    sha256_2 = hashlib.sha256(sha256_1).digest()
    checksum = sha256_2[:4]
    wif_bytes = prefix + checksum
    return base58.b58encode(wif_bytes).decode()
  
def connected(tag):

  global byte_seed
  byte_seed = bytearray()
  if isinstance(tag, nfc.tag.tt3.Type3Tag):
    try:
      for block_code in range(4):
        block_list = [nfc.tag.tt3.BlockCode(block_code)]
        data = tag.read_without_encryption([nfc.tag.tt3.ServiceCode(0,0x0B)], block_list)
        for block_data in data:
          block_data = block_data.to_bytes(1, byteorder='big')
          byte_seed.extend(block_data)
      byte_data = bytes(byte_seed)
      bip44_ctxs = Bip44.FromSeed(byte_data,Bip44Coins.EOS)
      bip44_ctx = bip44_ctxs.Purpose().Coin().Account(0)
      private_key_bytes = bip44_ctx.PrivateKey().Raw().ToBytes()
      enc = private_key_to_wif(private_key_bytes)
      print(f"{enc}")

      return True
    except Exception as e:
      print(f"Error occurred: {e}") 
      return False
  else:
    return False


with nfc.ContactlessFrontend('usb:054C') as m: 
  
    ##.connect()は、NFCデバイスと接続を確立するために利用される。
  tag = m.connect(rdwr={'on-connect': connected})
    #"m/44'/194'/0'/0/0"

