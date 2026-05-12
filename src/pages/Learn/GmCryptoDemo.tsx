import React, { useState } from 'react';
import { GMCrypto } from '@/utils/crypto/gmCrypto';
import { Button, Input } from 'antd';

const GmCryptoDemo: React.FC = () => {
  // SM2 相关状态
  const [sm2PlainText, setSm2PlainText] = useState<string>('测试SM2加密');
  const [sm2PublicKey, setSm2PublicKey] = useState<string>('');
  const [sm2PrivateKey, setSm2PrivateKey] = useState<string>('');
  const [sm2CipherText, setSm2CipherText] = useState<string>('');
  const [sm2DecryptedText, setSm2DecryptedText] = useState<string>('');

  // SM3 相关状态
  const [sm3PlainText, setSm3PlainText] = useState<string>('');
  const [sm3Hash, setSm3Hash] = useState<string>('');

  // SM4 相关状态
  const [sm4PlainText, setSm4PlainText] = useState<string>('测试SM4加密');
  const [sm4Key, setSm4Key] = useState<string>('');
  const [sm4Iv, setSm4Iv] = useState<string>('');
  const [sm4CipherText, setSm4CipherText] = useState<string>('');
  const [sm4DecryptedText, setSm4DecryptedText] = useState<string>('');

  // 生成SM2密钥对
  const handleGenerateSM2Key = () => {
    try {
      const { publicKey, privateKey } = GMCrypto.generateSM2KeyPair();
      setSm2PublicKey(publicKey);
      setSm2PrivateKey(privateKey);
    } catch (error) {
      alert(`生成SM2密钥失败：${(error as Error).message}`);
    }
  };

  // SM2加密
  const handleSM2Encrypt = () => {
    try {
      const cipherText = GMCrypto.sm2Encrypt(sm2PlainText, sm2PublicKey);
      setSm2CipherText(cipherText);
    } catch (error) {
      alert((error as Error).message);
    }
  };

  // SM2 解密
  const handleSM2Decrypt = () => {
    try {
      const decryptedText = GMCrypto.sm2Decrypt(sm2CipherText, sm2PrivateKey);
      setSm2DecryptedText(decryptedText);
    } catch (error) {
      alert((error as Error).message);
    }
  };

  // SM3 摘要
  const handleSM3Hash = () => {
    try {
      const hashText = GMCrypto.sm3Hash(sm3PlainText);
      setSm3Hash(hashText);
    } catch (error) {
      alert((error as Error).message);
    }
  };

  // 生成 SM4 密钥
  const handleGenerateSM4Key = () => {
    try {
      const key = GMCrypto.generateSM4Key();
      setSm4Key(key);
    } catch (error) {
      alert(`生成SM4密钥失败：${(error as Error).message}`);
    }
  };

  // 生成 SM4 向量
  const handleGenerateSM4Iv = () => {
    try {
      const iv = GMCrypto.generateSM4IV();
      setSm4Iv(iv);
    } catch (error) {
      alert(`生成SM4密钥失败：${(error as Error).message}`);
    }
  };

  // SM4 加密
  const handleSM4Encrypt = () => {
    try {
      const cipherText = GMCrypto.sm4Encrypt(sm4PlainText, sm4Key, sm4Iv);
      setSm4CipherText(cipherText);
    } catch (error) {
      alert((error as Error).message);
    }
  };

  // SM4 解密
  const handleSM4Decrypt = () => {
    try {
      const decryptedText = GMCrypto.sm4Decrypt(sm4CipherText, sm4Key, sm4Iv);
      setSm4DecryptedText(decryptedText);
    } catch (error) {
      alert((error as Error).message);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>国密算法 SM2/SM3/SM4 演示</h2>

      {/* SM2 加解密区域 */}
      <div style={{ margin: '20px 0', padding: '15px', border: '1px solid #eee' }}>
        <h3>SM2 非对称加解密</h3>
        <Button onClick={handleGenerateSM2Key} style={{ marginBottom: '10px' }}>
          生成 SM2 密钥对
        </Button>

        <div style={{ margin: '10px 0' }}>
          <label>SM2 公钥：</label>
          <Input
            type="text"
            value={sm2PublicKey}
            onChange={(e) => setSm2PublicKey(e.target.value)}
            placeholder="SM2 公钥（16 进制）"
            style={{ width: '100%', margin: '5px 0', padding: '8px' }}
          />
        </div>

        <div style={{ margin: '10px 0' }}>
          <label>SM2 私钥：</label>
          <Input
            type="text"
            value={sm2PrivateKey}
            onChange={(e) => setSm2PrivateKey(e.target.value)}
            placeholder="SM2 私钥（16 进制）"
            style={{ width: '100%', margin: '5px 0', padding: '8px' }}
          />
        </div>

        <div style={{ margin: '10px 0' }}>
          <label>明文：</label>
          <Input
            type="text"
            value={sm2PlainText}
            onChange={(e) => setSm2PlainText(e.target.value)}
            style={{ width: '100%', margin: '5px 0', padding: '8px' }}
          />
          <Button onClick={handleSM2Encrypt} style={{ marginRight: '10px' }}>
            SM2 加密
          </Button>
        </div>

        <div style={{ margin: '10px 0' }}>
          <label>SM2 密文：</label>
          <Input
            type="text"
            value={sm2CipherText}
            onChange={(e) => setSm2CipherText(e.target.value)}
            style={{ width: '100%', margin: '5px 0', padding: '8px', backgroundColor: '#f5f5f5' }}
          />
          <Button onClick={handleSM2Decrypt}>SM2 解密</Button>
        </div>

        <div style={{ margin: '10px 0' }}>
          <label>解密结果：</label>
          <Input
            type="text"
            value={sm2DecryptedText}
            onChange={(e) => setSm2DecryptedText(e.target.value)}
            style={{ width: '100%', margin: '5px 0', padding: '8px', backgroundColor: '#f5f5f5' }}
          />
        </div>
      </div>

      {/* SM3 摘要区 */}
      <div style={{ margin: '20px 0', padding: '15px', border: '1px solid #eee' }}>
        <h3>SM3 摘要</h3>
        <Button onClick={handleSM3Hash} style={{ marginBottom: '10px' }}>
          生成 SM3 哈希摘要
        </Button>

        <div style={{ margin: '10px 0' }}>
          <label>SM3 原文：</label>
          <Input
            type="text"
            value={sm3PlainText}
            onChange={(e) => setSm3PlainText(e.target.value)}
            placeholder="SM3 原文"
            style={{ width: '100%', margin: '5px 0', padding: '8px' }}
          />
        </div>

        <div style={{ margin: '10px 0' }}>
          <label>SM3 摘要：</label>
          <Input
            type="text"
            value={sm3Hash}
            placeholder="SM3 原文"
            style={{ width: '100%', margin: '5px 0', padding: '8px' }}
          />
        </div>
      </div>

      {/* SM4 加解密区域 */}
      <div style={{ margin: '20px 0', padding: '15px', border: '1px solid #eee' }}>
        <h3>SM4 对称加解密</h3>
        <Button onClick={handleGenerateSM4Key} style={{ marginBottom: '10px' }}>
          生成 SM4 密钥（32 位 16 进制）
        </Button>

        <div style={{ margin: '10px 0' }}>
          <label>SM4 密钥：</label>
          <Input
            type="text"
            value={sm4Key}
            onChange={(e) => setSm4Key(e.target.value)}
            placeholder="SM4 密钥（32 位 16 进制）"
            style={{ width: '100%', margin: '5px 0', padding: '8px' }}
          />
        </div>

        <Button onClick={handleGenerateSM4Iv} style={{ marginBottom: '10px' }}>
          生成 SM4 向量（32 位 16 进制）
        </Button>

        <div style={{ margin: '10px 0' }}>
          <label>SM4 向量：</label>
          <Input
            type="text"
            value={sm4Iv}
            onChange={(e) => setSm4Iv(e.target.value)}
            placeholder="SM4 向量（32 位 16 进制）"
            style={{ width: '100%', margin: '5px 0', padding: '8px' }}
          />
        </div>

        <div style={{ margin: '10px 0' }}>
          <label>明文：</label>
          <Input
            type="text"
            value={sm4PlainText}
            onChange={(e) => setSm4PlainText(e.target.value)}
            style={{ width: '100%', margin: '5px 0', padding: '8px' }}
          />
          <Button onClick={handleSM4Encrypt} style={{ marginRight: '10px' }}>
            SM4加密
          </Button>
        </div>

        <div style={{ margin: '10px 0' }}>
          <label>SM4 密文：</label>
          <Input
            type="text"
            value={sm4CipherText}
            onChange={(e) => setSm4CipherText(e.target.value)}
            style={{ width: '100%', margin: '5px 0', padding: '8px', backgroundColor: '#f5f5f5' }}
          />
          <Button onClick={handleSM4Decrypt}>SM4 解密</Button>
        </div>

        <div style={{ margin: '10px 0' }}>
          <label>解密结果：</label>
          <Input
            type="text"
            value={sm4DecryptedText}
            onChange={(e) => setSm4DecryptedText(e.target.value)}
            style={{ width: '100%', margin: '5px 0', padding: '8px', backgroundColor: '#f5f5f5' }}
          />
        </div>
      </div>
    </div>
  );
};

export default GmCryptoDemo;
