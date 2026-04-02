'use client'
import { DownloadPdfButton } from '@/components/download-pdf-button'
import { useState, useEffect, useCallback } from 'react'
import { EnergyCardsList, defaultEnergies, type EnergyData } from '@/components/energy-card'
import { HazardAccordionList, defaultHazards, type HazardData } from '@/components/hazard-accordion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Shield, 
  AlertTriangle, 
  Save, 
  RotateCcw,
  CheckCircle2,
  Factory,
  Camera, // Added Camera icon
  Trash2 // Added Trash2 icon
} from 'lucide-react'
import { cn } from '@/lib/utils'

// LocalStorage key
const STORAGE_KEY = 'hnr-risk-analysis-data'

interface FormData {
  machineName: string
  location: string
  serieModel: string
  evaluationLocation: string
  date: string
  machineImage: string | null // Added for image upload
  energies: EnergyData[]
  hazards: HazardData[]
}

const defaultFormData: FormData = {
  machineName: '',
  location: '',
  serieModel: '',
  evaluationLocation: '',
  date: new Date().toISOString().split('T')[0],
  machineImage: null, // Initialized to null
  energies: defaultEnergies,
  hazards: defaultHazards,
}

export default function HNRRiskAnalysisPage() {
  const [formData, setFormData] = useState<FormData>(defaultFormData)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null); // New state for image preview

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY)
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        setFormData(parsed)
      } catch (e) {
        console.error('Failed to load saved data', e)
      }
    }
  }, [])

  // Effect to set image preview when formData.machineImage changes
  useEffect(() => {
    if (formData.machineImage) {
      setImagePreview(formData.machineImage);
    } else {
      setImagePreview(null);
    }
  }, [formData.machineImage]);

  // Auto-save to localStorage
  const saveToLocalStorage = useCallback(() => {
    setIsSaving(true)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
    setLastSaved(new Date())
    setTimeout(() => setIsSaving(false), 500)
  }, [formData])

  // Auto-save on changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      saveToLocalStorage()
    }, 1000)
    return () => clearTimeout(timer)
  }, [formData, saveToLocalStorage])

  const handleReset = () => {
    if (confirm('¿Está seguro de que desea reiniciar el formulario? Se perderán todos los datos.')) {
      setFormData(defaultFormData)
      localStorage.removeItem(STORAGE_KEY)
      setLastSaved(null)
    }
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({ ...prev, machineImage: base64String }));
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({ ...prev, machineImage: null }));
      setImagePreview(null);
    }
  };

  const handleClearImage = () => {
    setFormData(prev => ({ ...prev, machineImage: null }));
    setImagePreview(null);
    // Optionally, reset the file input value if needed
    const fileInput = document.getElementById('machine-image-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Count active energies
  const activeEnergiesCount = formData.energies.filter(e => e.present).length
  
  // Calculate total HNR
  const totalHNR = formData.hazards.reduce((sum, h) => {
    return sum + (h.frequency * h.severity * h.numberOfPersons * h.probability)
  }, 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">Análisis HRN</h1>
                <p className="text-xs text-muted-foreground">Evaluación de Riesgos</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {lastSaved && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  {isSaving ? (
                    <Save className="h-3.5 w-3.5 animate-pulse" />
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5 text-risk-low" />
                  )}
                  <span className="hidden sm:inline">
                    Guardado {lastSaved.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )}
              <DownloadPdfButton formData={formData} totalHNR={totalHNR} />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleReset}
                className="text-xs"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                Reiniciar
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">
        {/* Machine Info Section */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Factory className="h-5 w-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">
              Información de la Máquina
            </h2>
          </div>
          
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="machine-name" className="text-sm font-medium">
                  Máquina, Herramienta y/o Equipo
                </Label>
                <Input
                  id="machine-name"
                  placeholder=""
                  value={formData.machineName}
                  onChange={(e) => setFormData({ ...formData, machineName: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="serie-model" className="text-sm font-medium">
                  Número de Serie y/o Modelo
                </Label>
                <Input
                  id="serie-model"
                  placeholder=""
                  value={formData.serieModel}
                  onChange={(e) => setFormData({ ...formData, serieModel: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="location" className="text-sm font-medium">
                  Ubicación
                </Label>
                <Input
                    id="location"
                    placeholder=""
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="evaluation-location" className="text-sm font-medium">
                  Lugar de Evaluación
                </Label>
                <Input
                    id="evaluation-location"
                    placeholder=""
                    value={formData.evaluationLocation}
                    onChange={(e) => setFormData({ ...formData, evaluationLocation: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="date" className="text-sm font-medium">
                  Fecha de Evaluación
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Image Upload Section */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Camera className="h-5 w-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">
              Imagen de la Máquina
            </h2>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="grid gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="machine-image-upload" className="text-sm font-medium">
                  Subir Imagen
                </Label>
                <Input
                  id="machine-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground file:border-none file:rounded-md file:px-3 file:py-1.5 file:mr-2 hover:file:bg-primary/90"
                />
              </div>

              {imagePreview && (
                <div className="relative w-full h-48 rounded-md overflow-hidden border border-border flex items-center justify-center bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt="Vista previa de la máquina"
                    className="object-contain max-h-full max-w-full"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={handleClearImage}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Section 1: Energy Cards */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <h2 className="text-base font-semibold text-foreground">
                Energías Presentes
              </h2>
            </div>
            {activeEnergiesCount > 0 && (
                <Badge variant="secondary" className="bg-warning/20 text-warning-foreground">
                  {activeEnergiesCount} activa{activeEnergiesCount !== 1 ? 's' : ''}
                </Badge>
            )}
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Identifique las energías presentes en la máquina o equipo.
            Active el interruptor si la energía está presente.
          </p>

          <EnergyCardsList
              energies={formData.energies}
              onChange={(energies) => setFormData({ ...formData, energies })}
          />
        </section>

        {/* Section 2: Hazard Assessment */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <h2 className="text-base font-semibold text-foreground">
                Identificación de Peligros
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">HNR Total:</span>
              <Badge
                  className={cn(
                      'px-3 py-1 font-semibold',
                      totalHNR >= 50 ? 'bg-risk-high text-white' :
                          totalHNR >= 20 ? 'bg-risk-medium text-warning-foreground' :
                              totalHNR >= 10 ? 'bg-risk-low text-white' :
                                  'bg-risk-very-low text-white'
                  )}
              >
                {totalHNR.toFixed(0)}
              </Badge>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Expanda cada tipo de peligro para completar la evaluación HNR (Hazard Rating Number).
          </p>

          <HazardAccordionList
              hazards={formData.hazards}
              onChange={(hazards) => setFormData({ ...formData, hazards })}
          />
        </section>

        {/* Summary Footer */}
        <section className="rounded-xl border-2 border-primary/20 bg-primary/5 p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">
            Resumen de la Evaluación
          </h3>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-card p-4 border border-border">
              <span className="text-xs text-muted-foreground block mb-1">Máquina</span>
              <span className="text-sm font-medium text-foreground">
                {formData.machineName || '—'}
              </span>
            </div>
            <div className="rounded-lg bg-card p-4 border border-border">
              <span className="text-xs text-muted-foreground block mb-1">Energías Activas</span>
              <span className="text-sm font-medium text-foreground">
                {activeEnergiesCount} de {formData.energies.length}
              </span>
            </div>
            <div className="rounded-lg bg-card p-4 border border-border">
              <span className="text-xs text-muted-foreground block mb-1">HNR Total</span>
              <span className={cn(
                  'text-lg font-bold',
                  totalHNR >= 50 ? 'text-risk-high' :
                      totalHNR >= 20 ? 'text-warning' :
                          totalHNR >= 10 ? 'text-risk-low' :
                              'text-risk-very-low'
              )}>
                {totalHNR.toFixed(1)}
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-risk-high" />
              <span>Muy Alto ({'>'}500): Instalación de medidas de mitigación de riesgo urgentes</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-risk-high" />
              <span>Alto (51-500): Importante dar prioridad a instalación de medidas.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-risk-medium" />
              <span>Medio (21-50): Deben considerarse medidas de mitigación del riesgo.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-risk-low" />
              <span>Bajo (6-20): Medidas administrativas, señalización y EPP suficientes.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-risk-very-low" />
              <span>Muy Bajo (0-5): No son necesarias medias adicionales a las actuales.</span>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Spacing for Mobile */}
      <div className="h-8" />
    </div>
  )
}
