from enum import Enum

class TipoTransacaoEnum(Enum):
    PIX = 'PIX'
    TED = 'TED'
    BOLETO = 'BOLETO'
    SISTEMICO = 'SISTEMICO'

class ClassificacaoEnum(Enum):
    INICIO = 'Início'
    EXPANSAO = 'Expansão'
    MADURA = 'Madura'
    DECLINIO = 'Declínio'
    NAO_CLASSIFICADO = 'Não Classificado'