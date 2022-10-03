import { computed } from 'vue'
import { ICar } from '@/modules/recipes/model'

export function useCarFieldOptions (car: ICar | any) {
  // TODO: Get this from carType collection
  const carTypeOptions = [
    { label: 'Sedan', value: 'sedan' },
    { label: 'Hatch-back', value: 'hatch-back' },
    { label: 'Sub-compact', value: 'sub-compact' },
    { label: 'Crossover', value: 'cross-over' },
    { label: 'SUV', value: 'suv' },
    { label: 'Pickup Truck', value: 'pickup-truck' },
    { label: 'Mid-size Truck', value: 'mid-size-truck' },
    { label: 'Large Truck', value: 'large-truck' },
    { label: 'Van', value: 'van' }
  ]

  // TODO: Get this from carModel collection
  const carModelOptions = computed(() => {
    if (car.type === 'pickup-truck') {
      return [
        { label: 'Toyota Hillux', value: 'toyota-hillux' },
        { label: 'Nissan Navara', value: 'nissan-navara' },
        { label: 'Ford Ranger', value: 'ford-ranger' },
        { label: 'Mitsubishi Strada', value: 'mitsubishi-strada' },
        { label: 'Isuzu DMax', value: 'isuzu-dmax' }
      ]
    }
    return []
  })

  // TODO: Get this from carMake collection
  const carMakeOptions = computed(() => {
    if (car.type === 'pickup-truck' && car.model === 'nissan-navara') {
      return [
        'VE 4x2 M/T Calibre',
        'VE 4x2 A/T Calibre',
        'VE 4x4 M/T',
        'VL 4x2 M/T Calibre',
        'VL 4x2 A/T Calibre',
        'Calibre X',
        'VL 4x4 M/T',
        'VL 4x4 A/T',
        'Pro 4x'
      ]
    }
    return []
  })

  // TODO: Get this from carYear collection
  const carYearOptions = computed(() => {
    if (car.type === 'pickup-truck' && car.model === 'nissan-navara') {
      return [
        2019, 2020, 2021, 2022
      ]
    }
    return []
  })

  return { carTypeOptions, carMakeOptions, carModelOptions, carYearOptions }
}
