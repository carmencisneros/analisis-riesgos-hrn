'use client'

import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Cog,
  Zap,
  Flame,
  Volume2,
  Vibrate,
  type LucideIcon,
} from 'lucide-react'

export type HazardType = 
  | 'mechanical'
  | 'electrical'
  | 'thermal'
  | 'noise'
  | 'vibration'

export interface HazardData {
  type: HazardType
  origin: string
  frequency: number
  severity: number
  numberOfPersons: number
  probability: number
  action: string
}

interface HazardAccordionProps {
  hazards: HazardData[]
  onChange: (hazards: HazardData[]) => void
}

const hazardConfig: Record<HazardType, { label: string; labelEs: string; Icon: LucideIcon; color: string }> = {
  mechanical: {
    label: 'Mechanical',
    labelEs: 'Mecánico',
    Icon: Cog,
    color: 'text-amber-600',
  },
  electrical: {
    label: 'Electrical',
    labelEs: 'Eléctrico',
    Icon: Zap,
    color: 'text-yellow-500',
  },
  thermal: {
    label: 'Thermal',
    labelEs: 'Térmico',
    Icon: Flame,
    color: 'text-orange-500',
  },
  noise: {
    label: 'Noise',
    labelEs: 'Ruido',
    Icon: Volume2,
    color: 'text-blue-500',
  },
  vibration: {
    label: 'Vibration',
    labelEs: 'Vibraciones',
    Icon: Vibrate,
    color: 'text-purple-500',
  },
}

// HNR Calculation
function calculateHNR(data: HazardData): number {
  return data.frequency * data.severity * data.numberOfPersons * data.probability
}

// Risk Level Determination
function getRiskLevel(hnr: number): { level: string; levelEs: string; color: string; bgColor: string } {
  if (hnr >= 50) return { level: 'High', levelEs: 'Alto', color: 'text-white', bgColor: 'bg-risk-high' }
  if (hnr >= 20) return { level: 'Medium', levelEs: 'Medio', color: 'text-warning-foreground', bgColor: 'bg-risk-medium' }
  if (hnr >= 10) return { level: 'Low', levelEs: 'Bajo', color: 'text-white', bgColor: 'bg-risk-low' }
  if (hnr >= 5) return { level: 'Very Low', levelEs: 'Muy Bajo', color: 'text-white', bgColor: 'bg-risk-very-low' }
  return { level: 'Negligible', levelEs: 'Despreciable', color: 'text-white', bgColor: 'bg-risk-negligible' }
}

// Frequency Options
const frequencyOptions = [
  { value: 1, label: 'Rara vez', description: 'Una vez al año o menos' },
  { value: 2, label: 'Ocasional', description: 'Mensualmente' },
  { value: 3, label: 'Frecuente', description: 'Semanalmente' },
  { value: 4, label: 'Varias veces/día', description: 'Múltiples veces al día' },
  { value: 5, label: 'Constante', description: 'Exposición continua' },
]

// Severity Options
const severityOptions = [
  { value: 0.1, label: 'Rasguño', description: 'Lesión superficial mínima' },
  { value: 0.5, label: 'Laceración', description: 'Corte o herida leve' },
  { value: 1, label: 'Fractura menor', description: 'Hueso pequeño' },
  { value: 2, label: 'Fractura mayor', description: 'Hueso grande' },
  { value: 4, label: 'Pérdida miembro', description: 'Amputación' },
  { value: 8, label: 'Muerte', description: 'Fatal' },
]

// Number of Persons Options
const personsOptions = [
  { value: 1, label: '1 a 2', description: '1-2 personas' },
  { value: 2, label: '3 a 7', description: '3-7 personas' },
  { value: 4, label: '8 a 15', description: '8-15 personas' },
  { value: 8, label: '16 a 50', description: '16-50 personas' },
  { value: 12, label: '50+', description: 'Más de 50' },
]

// Probability Options
const probabilityOptions = [
  { value: 0.1, label: 'Casi imposible', description: '<0.01%' },
  { value: 1, label: 'Muy improbable', description: '0.01-0.1%' },
  { value: 2, label: 'Posible', description: '0.1-1%' },
  { value: 5, label: 'Algo probable', description: '1-10%' },
  { value: 8, label: 'Probable no sorprende', description: '10-50%' },
  { value: 10, label: 'Probable', description: '>50%' },
  { value: 15, label: 'Muy probable', description: '>90%' },
]

interface SegmentedControlProps {
  options: { value: number; label: string; description: string }[]
  value: number
  onChange: (value: number) => void
  label: string
}

function SegmentedControl({ options, value, onChange, label }: SegmentedControlProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              'flex flex-col items-center justify-center rounded-lg px-3 py-2 text-xs transition-all min-w-[80px]',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1',
              value === option.value
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-card text-foreground border border-border hover:bg-accent'
            )}
          >
            <span className="font-semibold">{option.label}</span>
            <span className={cn(
              'text-[10px] mt-0.5',
              value === option.value ? 'text-primary-foreground/80' : 'text-muted-foreground'
            )}>
              ({option.value})
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

interface HazardFormProps {
  data: HazardData
  onChange: (data: HazardData) => void
}

function HazardForm({ data, onChange }: HazardFormProps) {
  const hnr = useMemo(() => calculateHNR(data), [data])
  const riskLevel = useMemo(() => getRiskLevel(hnr), [hnr])

  return (
    <div className="flex flex-col gap-6 pt-2">
      {/* Origin Field */}
      <div className="flex flex-col gap-2">
        <Label htmlFor={`origin-${data.type}`} className="text-sm font-medium">
          Origen del Peligro
        </Label>
        <Input
          id={`origin-${data.type}`}
          placeholder="ej. Bordes afilados, Contacto directo..."
          value={data.origin}
          onChange={(e) => onChange({ ...data, origin: e.target.value })}
          className="bg-card"
        />
      </div>

      {/* HNR Parameters */}
      <div className="flex flex-col gap-5 rounded-lg border border-border bg-secondary/30 p-4">
        <h4 className="text-sm font-semibold text-foreground">Parámetros HNR</h4>

        <SegmentedControl
          label="Frecuencia de Exposición"
          options={frequencyOptions}
          value={data.frequency}
          onChange={(value) => onChange({ ...data, frequency: value })}
        />

        <SegmentedControl
          label="Severidad de la Lesión"
          options={severityOptions}
          value={data.severity}
          onChange={(value) => onChange({ ...data, severity: value })}
        />

        <SegmentedControl
          label="Número de Personas Expuestas"
          options={personsOptions}
          value={data.numberOfPersons}
          onChange={(value) => onChange({ ...data, numberOfPersons: value })}
        />

        <SegmentedControl
          label="Probabilidad de Ocurrencia"
          options={probabilityOptions}
          value={data.probability}
          onChange={(value) => onChange({ ...data, probability: value })}
        />
      </div>

      {/* Results Section */}
      <div className="flex flex-col gap-4 rounded-lg border-2 border-border bg-card p-4">
        <h4 className="text-sm font-semibold text-foreground">Resultado de la Evaluación</h4>
        
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">HNR Total</span>
            <span className="text-3xl font-bold text-foreground">{hnr.toFixed(1)}</span>
          </div>
          
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Nivel de Riesgo</span>
            <Badge 
              className={cn(
                'px-4 py-2 text-sm font-semibold',
                riskLevel.bgColor,
                riskLevel.color
              )}
            >
              {riskLevel.levelEs}
            </Badge>
          </div>
        </div>

        {/* Formula Display */}
        <div className="rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground font-mono">
          HNR = {data.frequency} × {data.severity} × {data.numberOfPersons} × {data.probability} = {hnr.toFixed(1)}
        </div>
      </div>

      {/* Action Field */}
      <div className="flex flex-col gap-2">
        <Label htmlFor={`action-${data.type}`} className="text-sm font-medium">
          Acción Recomendada
        </Label>
        <Textarea
          id={`action-${data.type}`}
          placeholder="Describa las medidas de control o acciones recomendadas..."
          value={data.action}
          onChange={(e) => onChange({ ...data, action: e.target.value })}
          className="bg-card min-h-[80px]"
        />
      </div>
    </div>
  )
}

export function HazardAccordionList({ hazards, onChange }: HazardAccordionProps) {
  const handleHazardChange = (index: number, data: HazardData) => {
    const newHazards = [...hazards]
    newHazards[index] = data
    onChange(newHazards)
  }

  return (
    <Accordion type="multiple" className="flex flex-col gap-3">
      {hazards.map((hazard, index) => {
        const config = hazardConfig[hazard.type]
        const { Icon, labelEs, color } = config
        const hnr = calculateHNR(hazard)
        const riskLevel = getRiskLevel(hnr)

        return (
          <AccordionItem
            key={hazard.type}
            value={hazard.type}
            className="rounded-lg border border-border bg-card px-4 data-[state=open]:bg-card"
          >
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3 flex-1">
                <div className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-lg bg-muted'
                )}>
                  <Icon className={cn('h-5 w-5', color)} strokeWidth={2} />
                </div>
                <div className="flex flex-col items-start gap-0.5">
                  <span className="text-sm font-semibold text-foreground">
                    Tipo {labelEs}
                  </span>
                  {hazard.origin && (
                    <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {hazard.origin}
                    </span>
                  )}
                </div>
                <div className="ml-auto mr-4 flex items-center gap-3">
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-muted-foreground">HNR</span>
                    <span className="text-lg font-bold text-foreground">{hnr.toFixed(0)}</span>
                  </div>
                  <Badge 
                    className={cn(
                      'px-3 py-1 text-xs font-medium',
                      riskLevel.bgColor,
                      riskLevel.color
                    )}
                  >
                    {riskLevel.levelEs}
                  </Badge>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <HazardForm
                data={hazard}
                onChange={(data) => handleHazardChange(index, data)}
              />
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}

// Default initial state
export const defaultHazards: HazardData[] = [
  { type: 'mechanical', origin: '', frequency: 5, severity: 4, numberOfPersons: 1, probability: 1, action: '' },
  { type: 'electrical', origin: '', frequency: 5, severity: 0.1, numberOfPersons: 1, probability: 2, action: '' },
  { type: 'thermal', origin: '', frequency: 5, severity: 0.5, numberOfPersons: 1, probability: 2, action: '' },
  { type: 'noise', origin: '', frequency: 5, severity: 0.5, numberOfPersons: 1, probability: 8, action: '' },
  { type: 'vibration', origin: '', frequency: 4, severity: 0.5, numberOfPersons: 1, probability: 2, action: '' },
]
export function getHazardLabel(type: HazardType): string {
  return hazardConfig[type]?.labelEs || type;
}