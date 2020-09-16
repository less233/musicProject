import {
    state
} from './state'
import {
    mutations
} from './mutations'

export const primaryModule = {
    namespaced: true,
    state,
    mutations
}