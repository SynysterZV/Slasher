import { config } from 'dotenv'
import Client from './client'

config()

new Client().init()