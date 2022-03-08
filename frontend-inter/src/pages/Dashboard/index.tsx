import { useEffect, useState } from 'react';
import {DashboardBackground, BodyContainer, InlineContainer, InlineTitle} from './styles';

import Header from '../../components/Header';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import useAuth from '../../hooks/useAuth';

import Statement from './Statement';

import { pay, request } from '../../services/resources/pix';

const Dashboard = () => {

    const { user, getCurrentUser } = useAuth();
    const wallet = user?.wallet || 0;

    const [ key, setKey ] = useState('');
    const [ generatedKey, setGeneratedKey ] = useState('');
    const [ messagePayment, setMessagePayment ] = useState('');
    const [ value, setValue ] = useState('');

    useEffect(() => {
        getCurrentUser()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if(!user) {
        return null;
    }

    const handleNewPayment = async () => {
        const {data} = await request(Number(value));
    
        if(data.copyPasteKey) {
          setGeneratedKey(data.copyPasteKey);
        }
      }
    
      const handlePayPix = async () => {
        try {
          const { data } = await pay(key);
    
          if(data.msg) {
            alert('Pagamento efetuado com sucesso!');
            setMessagePayment('Pagamento efetuado com sucesso!');
            return;
          }
    
          alert('Não foi possível realizar o pagamento!');
          return setMessagePayment('Não foi possível realizar o pagamento!');
        } catch (e) {
          console.log(e);
            setMessagePayment('Não é possível receber o PIX do mesmo usuário!');
            alert('Não é possível receber o PIX do mesmo usuário!');
        }
      }

    return (
        <DashboardBackground>
            <Header />
            <BodyContainer>
                <div>
                   <Card noShadow width="90%">
                       <InlineTitle>
                        <h2 className="h2">Saldo Atual</h2>
                       </InlineTitle>
                       <InlineContainer>
                            <h3 className="wallet">
                                {wallet.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}
                            </h3>
                        </InlineContainer>
                   </Card>
                   <Card noShadow width="90%">
                       <InlineTitle>
                        <h2 className="h2">Receber PIX</h2>
                       </InlineTitle>

                       <InlineContainer>
                            <Input 
                                style={{flex: 1}} 
                                placeholder="Valor" 
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                            />
                            <Button onClick={handleNewPayment}>Gerar Código</Button>
                        </InlineContainer>

                        {generatedKey &&
                            <>
                                <p className="primary-color">Pix copia e cola</p>
                                <p className="primary-color">{generatedKey}</p>
                            </>
                        }
                        
                   </Card>
                   <Card noShadow width="90%">
                        <InlineTitle>
                            <h2 className="h2">Pagar PIX</h2>
                        </InlineTitle>

                        <InlineContainer>
                            <Input 
                                style={{flex: 1}} 
                                placeholder="Insira a chave" 
                                value={key}
                                onChange={(e) => setKey(e.target.value)}
                            />
                            <Button onClick={handlePayPix} >Pagar Pix</Button>
                        </InlineContainer>

                        {messagePayment && 
                        <p className="primary-color">{messagePayment}</p>
                        }
                   </Card>
                </div>
                <div>
                    <Card noShadow width="90%">
                      <InlineTitle>
                      <h2 className="h2">Extrato da conta</h2>
                      </InlineTitle>

                      <Statement />
                   </Card>
                </div>
            </BodyContainer>
        </DashboardBackground>
    )
}

export default Dashboard