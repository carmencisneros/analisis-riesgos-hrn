'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Zap,
  Cog,
  Wind,
  Droplets,
  Flame,
  type LucideIcon,
} from 'lucide-react'

export type EnergyType = 
  | 'mechanical'
  | 'electrical'
  | 'pneumatic'
  | 'hydraulic'
  | 'thermal'
  | 'residual'

export interface EnergyData {
  type: EnergyType
  present: boolean
  requiresLockout: boolean
  residualEnergy: 'S' | 'N' | 'D' | null
}

interface EnergyCardProps {
  type: EnergyType
  data: EnergyData
  onChange: (data: EnergyData) => void
}

const energyConfig: Record<EnergyType, { label: string; labelEs: string; Icon: LucideIcon; color: string }> = {
  mechanical: {
    label: 'Mechanical',
    labelEs: 'Mecánica',
    Icon: Cog,
    color: 'text-amber-600',
  },
  electrical: {
    label: 'Electrical',
    labelEs: 'Eléctrica',
    Icon: Zap,
    color: 'text-yellow-500',
  },
  pneumatic: {
    label: 'Pneumatic',
    labelEs: 'Neumática',
    Icon: Wind,
    color: 'text-sky-500',
  },
  hydraulic: {
    label: 'Hydraulic',
    labelEs: 'Hidráulica',
    Icon: Droplets,
    color: 'text-blue-600',
  },
  thermal: {
    label: 'Thermal',
    labelEs: 'Térmica',
    Icon: Flame,
    color: 'text-orange-500',
  },
  residual: {
    label: 'Residual',
    labelEs: 'Residual',
    Icon: Zap,
    color: 'text-gray-500',
  },
}

export function EnergyCard({ type, data, onChange }: EnergyCardProps) {
  const config = energyConfig[type]
  const { Icon, labelEs, color } = config

  const handlePresenceChange = (present: boolean) => {
    onChange({
      ...data,
      present,
      requiresLockout: present ? data.requiresLockout : false,
      residualEnergy: present ? data.residualEnergy : null,
    })
  }

  const handleLockoutChange = (requiresLockout: boolean) => {
    onChange({ ...data, requiresLockout })
  }

  const handleResidualChange = (value: 'S' | 'N' | 'D') => {
    onChange({ ...data, residualEnergy: value })
  }

  return (
    <Card
      className={cn(
        'transition-all duration-300 ease-in-out',
        data.present 
          ? 'border-warning border-2 bg-warning/5' 
          : 'border-border bg-card'
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              'flex h-12 w-12 items-center justify-center rounded-lg',
              data.present ? 'bg-warning/20' : 'bg-muted'
            )}>
              <Icon className={cn('h-6 w-6', color)} strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">{labelEs}</h3>
              <p className="text-sm text-muted-foreground">Energía {labelEs.toLowerCase()}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Label htmlFor={`presence-${type}`} className="text-xs text-muted-foreground">
              ¿Presente?
            </Label>
            <Switch
              id={`presence-${type}`}
              checked={data.present}
              onCheckedChange={handlePresenceChange}
              className="data-[state=checked]:bg-warning"
            />
          </div>
        </div>
      </CardHeader>

      {/* Conditional Controls - Progressive Disclosure */}
      <div
        className={cn(
          'grid transition-all duration-300 ease-in-out',
          data.present 
            ? 'grid-rows-[1fr] opacity-100' 
            : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className="overflow-hidden">
          <CardContent className="pt-0 pb-4">
            <div className="flex flex-col gap-4 border-t border-border/50 pt-4">
              {/* Requires Lockout */}
              <div className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3">
                <div className="flex flex-col">
                  <Label htmlFor={`lockout-${type}`} className="text-sm font-medium">
                    ¿Requiere Bloqueo?
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    Lockout/Tagout necesario
                  </span>
                </div>
                <Switch
                  id={`lockout-${type}`}
                  checked={data.requiresLockout}
                  onCheckedChange={handleLockoutChange}
                />
              </div>

              {/* Residual Energy */}
              <div className="flex flex-col gap-2 rounded-lg bg-secondary/50 px-4 py-3">
                <Label className="text-sm font-medium">
                  ¿Energía Residual?
                </Label>
                <div className="flex gap-2">
                  {(['S', 'N', 'D'] as const).map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleResidualChange(value)}
                      className={cn(
                        'flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-all',
                        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                        data.residualEnergy === value
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'bg-card text-foreground border border-border hover:bg-accent'
                      )}
                    >
                      {value === 'S' ? 'Sí' : value === 'N' ? 'No' : 'Desconocido'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  )
}

// Energy Cards List Component
interface EnergyCardsListProps {
  energies: EnergyData[]
  onChange: (energies: EnergyData[]) => void
}

export function EnergyCardsList({ energies, onChange }: EnergyCardsListProps) {
  const handleEnergyChange = (index: number, data: EnergyData) => {
    const newEnergies = [...energies]
    newEnergies[index] = data
    onChange(newEnergies)
  }

  return (
    <div className="flex flex-col gap-4">
      {energies.map((energy, index) => (
        <EnergyCard
          key={energy.type}
          type={energy.type}
          data={energy}
          onChange={(data) => handleEnergyChange(index, data)}
        />
      ))}
    </div>
  )
}

// Default initial state
export const defaultEnergies: EnergyData[] = [
  { type: 'mechanical', present: false, requiresLockout: false, residualEnergy: null },
  { type: 'electrical', present: false, requiresLockout: false, residualEnergy: null },
  { type: 'pneumatic', present: false, requiresLockout: false, residualEnergy: null },
  { type: 'hydraulic', present: false, requiresLockout: false, residualEnergy: null },
  { type: 'thermal', present: false, requiresLockout: false, residualEnergy: null },
]
