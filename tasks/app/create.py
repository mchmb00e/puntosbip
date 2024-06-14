import pandas as pd
import sqlite3 as sq

def to_sqlite(csv, sqlite, table):
    df = pd.read_csv(csv)
    df.rename(columns={'index': 'id'}, inplace=True)
    conn = sq.connect(sqlite)
    df.to_sql(table, conn, if_exists='replace', index=False)
    conn.close()


metro = pd.read_excel('tasks/app/xlsx/metro.xlsx')
normal_estandar = pd.read_excel('tasks/app/xlsx/normal_estandar.xlsx')
alto_estandar = pd.read_excel('tasks/app/xlsx/alto_estandar.xlsx')
puntos_bip = pd.read_excel('tasks/app/xlsx/puntos_bip.xlsx')
retail = pd.read_excel('tasks/app/xlsx/retail.xlsx')

columns = {
    'metro': ['CODIGO', 'ENTIDAD', 'ESTACION', 'DIRECCION', 'COMUNA', 'HORARIO', 'ESTE', 'NORTE', 'LONGITUD', 'LATITUD'],
    'estandar': ['CODIGO', 'ENTIDAD', 'DIRECCION', 'COMUNA', 'HORARIO', 'ESTE', 'NORTE', 'LONGITUD', 'LATITUD'],
    'estandar_with_name': ['CODIGO', 'ENTIDAD', 'NOMBRE', 'DIRECCION', 'COMUNA', 'HORARIO', 'ESTE', 'NORTE', 'LONGITUD', 'LATITUD']
}

metro.columns = pd.Index(columns['metro'])
normal_estandar.columns = pd.Index(columns['estandar'])
alto_estandar.columns = pd.Index(columns['estandar'])
puntos_bip.columns = pd.Index(columns['estandar_with_name'])
retail.columns = pd.Index(columns['estandar_with_name'])

cond = 'COMUNA'

metro = metro.dropna(subset = cond).reset_index(drop = True).drop(index = 0).reset_index(drop = True).drop(['NORTE', 'ESTE'], axis=1)
normal_estandar = normal_estandar.dropna(subset = cond).reset_index(drop = True).drop(index = 0).reset_index(drop = True).drop(['NORTE', 'ESTE'], axis=1)
alto_estandar = alto_estandar.dropna(subset = cond).reset_index(drop = True).drop(index = 0).reset_index(drop = True).drop(['NORTE', 'ESTE'], axis=1)
puntos_bip = puntos_bip.dropna(subset = cond).reset_index(drop = True).drop(index = 0).reset_index(drop = True).drop(['NORTE', 'ESTE'], axis=1)
retail = retail.dropna(subset = cond).reset_index(drop = True).drop(index = 0).reset_index(drop = True).drop(['NORTE', 'ESTE'], axis=1)

metro = metro.assign(CATEGORIA='Metro').assign(FUNCIONES='Venta de tarjeta, Carga de tarjeta, Consulta de saldo, Activacion de carga remota')
normal_estandar = normal_estandar.assign(CATEGORIA='Centro Bip!').assign(FUNCIONES='Venta de tarjeta, Carga de tarjeta, Consulta de saldo, Activacion de carga remota')
alto_estandar = alto_estandar.assign(CATEGORIA='Centro Bip! Full').assign(FUNCIONES='Venta de tarjeta, Carga de tarjeta, Consulta de saldo, Activacion de carga remota, Reemplazo de tarjeta, Recuperacion de saldo de tarjetas corrompidas')
puntos_bip = puntos_bip.assign(CATEGORIA='Punto Bip!').assign(FUNCIONES='Carga de tarjeta, Consulta de saldo, Activacion de carga remota')
retail = retail.assign(CATEGORIA='Supermercados').assign(FUNCIONES='Carga de tarjeta')

retail = retail.drop('ENTIDAD', axis=1).rename(columns={'NOMBRE': 'ENTIDAD'})
puntos_bip = puntos_bip.drop('ENTIDAD', axis=1).rename(columns={'NOMBRE': 'ENTIDAD'})
metro['ENTIDAD'] = metro['ENTIDAD'].apply(lambda x: x + ' ').values + metro['ESTACION'].values
metro.drop('ESTACION', axis=1, inplace=True)

df = pd.concat([metro, normal_estandar, alto_estandar, puntos_bip, retail], axis=0).reset_index()
df['DIRECCION'] = df['DIRECCION'].apply(lambda x: x.upper()).apply(lambda x: x.replace("O'HIGGINS", 'O Higgins')).apply(lambda x: x.replace('O´HIGGINS', 'O Higgins')).apply(lambda x: x.replace('O´HIGGINS', 'O Higgins')).apply(lambda x: x.replace('O`HIGGINS', 'O Higgins')).apply(lambda x: x.title())
df['ENTIDAD'] = df['ENTIDAD'].apply(lambda x: x.upper()).apply(lambda x: x.replace("O'HIGGINS", 'O Higgins')).apply(lambda x: x.replace('O´HIGGINS', 'O Higgins')).apply(lambda x: x.replace('O´HIGGINS', 'O Higgins')).apply(lambda x: x.replace('O`HIGGINS', 'O Higgins')).apply(lambda x: x.title())
df.fillna('No hay informacion disponible').to_csv('tasks/app/data/dataframe.csv', index=False)

to_sqlite('tasks/app/data/dataframe.csv', 'db.sqlite3', 'tasks_point')