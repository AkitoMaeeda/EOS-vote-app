import nfc
import sys
from bip_utils import Bip44, Bip44Coins
from Crypto.Hash import keccak


byte_seed = None
args = sys.argv

def connected(tag):
    global byte_seed
    byte_seed = bytearray()
    if isinstance(tag, nfc.tag.tt3.Type3Tag):
        try:
            # FeliCaからシードデータを取得
            for block_code in range(4):
                block_list = [nfc.tag.tt3.BlockCode(block_code)]
                data = tag.read_without_encryption([nfc.tag.tt3.ServiceCode(0, 0x0B)], block_list)
                for block_data in data:
                    block_data = block_data.to_bytes(1, byteorder='big')
                    byte_seed.extend(block_data)

            byte_data = bytes(byte_seed)

            # BIP44でEthereumアドレス生成
            bip44_ctxs = Bip44.FromSeed(byte_data, Bip44Coins.EOS)
            bip44_ctx = bip44_ctxs.Purpose().Coin().Account(int(args[1]))


            # 公開鍵を取得してEthereumアドレスに変換
            pub_key_bytes = bip44_ctx.PublicKey().RawCompressed().ToBytes()[1:]

            keccak_digest = keccak.new(digest_bits=256).update(pub_key_bytes).digest()

            # 3. 最後の20バイトをEthereumアドレスとする
            eth_address = "0x" + keccak_digest[-20:].hex()
            print(f"{eth_address}")  # アドレスをエンコード
            
            

            return True
        except Exception as e:
            print(f"Error: {str(e)}")
            return False
    else:
        return False


with nfc.ContactlessFrontend('usb:054C') as m:  # FeliCaリーダーをUSBデバイスとして扱う
    if isinstance(int(args[1]), int):
        # NFCデバイスと接続を確立
        tag = m.connect(rdwr={'on-connect': connected})